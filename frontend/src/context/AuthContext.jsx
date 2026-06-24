/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { apiInstance } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getLevelName = (xp) => {
  if (xp < 200) return "Otak Baru";
  if (xp < 600) return "Pelajar Pemula";
  if (xp < 1200) return "Siswa Berbakat";
  if (xp < 2000) return "Pelajar Nusantara";
  if (xp < 4000) return "Cendikiawan Muda";
  if (xp < 8000) return "Cendikiawan";
  if (xp < 15000) return "Jenius Lokal";
  return "Legenda Nusantara";
};

export const AuthProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  const fetchProfile = async () => {
    try {
      const [profileRes, scoresRes] = await Promise.all([
        apiInstance.get('/profiles/me'),
        apiInstance.get('/scores/me').catch(() => ({ data: { data: [] } }))
      ]);

      const profileData = profileRes.data.profile || profileRes.data.data;
      const scoresData = scoresRes.data.data || [];

      // Translate backend game types to frontend score object layout
      const frontendScores = {
        reaction: 0,
        aimTrainer: { score: 0, accuracy: 0 },
        numberMemory: 0,
        sequenceMemory: 0,
        visualMemory: 0,
        verbalMemory: 0,
        wawasanIndonesia: 0
      };

      scoresData.forEach(item => {
        const type = item.game_type;
        const val = item.score_value;
        const add = item.additional_data || {};

        if (type === 'reaction_time') {
          frontendScores.reaction = val;
        } else if (type === 'aim_trainer') {
          frontendScores.aimTrainer = { score: val, accuracy: add.accuracy || 0 };
        } else if (type === 'number_memory') {
          frontendScores.numberMemory = val;
        } else if (type === 'sequence_memory') {
          frontendScores.sequenceMemory = val;
        } else if (type === 'visual_memory') {
          frontendScores.visualMemory = val;
        } else if (type === 'verbal_memory') {
          frontendScores.verbalMemory = val;
        } else if (type === 'wawasan_indonesia') {
          frontendScores.wawasanIndonesia = val;
        }
      });

      const mergedClient = {
        username: profileData.username || 'Pemain',
        full_name: profileData.full_name || '',
        phone_number: profileData.phone_number || '',
        bio: profileData.bio || '',
        website: profileData.website || '',
        level: profileData.level || 1,
        levelName: getLevelName(profileData.xp || 0),
        xp: profileData.xp || 0,
        avatar: profileData.avatar_url || '🧠',
        joined: profileData.created_at || new Date().toISOString(),
        scores: frontendScores,
        achievements: profileData.achievements || [],
        gamesPlayed: profileData.games_played || 0
      };

      // Detect if user profile is incomplete (requires onboarding)
      // Auto-generated username usually starts with 'user_'. Guest mode bypasses.
      const isGuest = profileData.username?.startsWith('Tamu_');
      const isAutoUsername = !profileData.username || profileData.username.startsWith('user_');
      const isIncomplete = !isGuest && isAutoUsername;
      
      setIsProfileIncomplete(isIncomplete);
      setClient(mergedClient);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Failed to sync profile from backend:', err);
      // Suppress crash by creating a fallback profile if session exists
      const currentSession = await supabase.auth.getSession();
      if (currentSession?.data?.session?.user) {
        const user = currentSession.data.session.user;
        const autoUsername = user.email?.split('@')[0] || 'User';
        const isOAuth = user.app_metadata?.provider === 'google';
        
        setIsProfileIncomplete(isOAuth); // Google login defaults to incomplete in fallback state
        setClient({
          username: autoUsername,
          full_name: user.user_metadata?.full_name || '',
          phone_number: user.phone || '',
          bio: '',
          website: '',
          level: 1,
          levelName: "Otak Baru",
          xp: 0,
          avatar: '🧠',
          joined: new Date().toISOString(),
          scores: {
            reaction: 0,
            aimTrainer: { score: 0, accuracy: 0 },
            numberMemory: 0,
            sequenceMemory: 0,
            visualMemory: 0,
            verbalMemory: 0,
            wawasanIndonesia: 0
          },
          achievements: [],
          gamesPlayed: 0
        });
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check local session first
    const localSessionStr = localStorage.getItem('local_auth_session');
    if (localSessionStr) {
      try {
        const localSession = JSON.parse(localSessionStr);
        if (localSession?.access_token) {
          setSession(localSession);
          fetchProfile();
          return;
        }
      } catch (e) {
        console.error('Failed to parse local auth session:', e);
      }
    }

    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile();
      } else {
        setClient(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If we have a local session active, ignore Supabase auth changes unless we are logging out
      const hasLocalSession = localStorage.getItem('local_auth_session');
      if (hasLocalSession && _event !== 'SIGNED_OUT') {
        return;
      }

      setSession(session);
      if (session?.user) {
        await fetchProfile();
      } else {
        setClient(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      // 1. Try to log in via local API
      const data = await apiInstance.post('/auth/login', { email, password }).then(r => r.data);
      if (data.session) {
        if (data.session.refresh_token === 'mock-refresh-token') {
          // Local mode
          localStorage.setItem('local_auth_session', JSON.stringify(data.session));
          setSession(data.session);
          await fetchProfile();
        } else {
          // Supabase mode
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
        }
      }
      return data;
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Gagal masuk';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email, password, username, fullName) => {
    setLoading(true);
    try {
      const data = await apiInstance.post('/auth/signup', { email, password, username, fullName }).then(r => r.data);
      if (data.session) {
        if (data.session.refresh_token === 'mock-refresh-token') {
          // Local mode
          localStorage.setItem('local_auth_session', JSON.stringify(data.session));
          setSession(data.session);
          await fetchProfile();
        } else {
          // Supabase mode
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
        }
      }
      return data;
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Gagal mendaftar';
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    try {
      const randId = Math.floor(Math.random() * 90000) + 10000;
      const email = `guest_${randId}@nusa-bench.local`;
      const username = `Tamu_${randId}`;
      const password = Math.random().toString(36).substring(2, 15) + 'Aa1!';
      
      // Try local signup/login first
      try {
        const data = await apiInstance.post('/auth/signup', { email, password, username, fullName: 'Tamu' }).then(r => r.data);
        if (data.session && data.session.refresh_token === 'mock-refresh-token') {
          localStorage.setItem('local_auth_session', JSON.stringify(data.session));
          setSession(data.session);
          await fetchProfile();
          return;
        }
      } catch (err) {
        // Fallback to Supabase Anonymous login
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
      }
    } catch (e) {
      console.error('Guest login failed:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('local_auth_session');
    await supabase.auth.signOut();
    setClient(null);
    setSession(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updatedData) => {
    const payload = {
      full_name: updatedData.full_name,
      username: updatedData.username,
      phone_number: updatedData.phone_number,
      bio: updatedData.bio,
      avatar_url: updatedData.avatar_url
    };
    await apiInstance.put('/profiles/me', payload);
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{
      client,
      session,
      isAuthenticated,
      loading,
      isProfileIncomplete,
      setIsProfileIncomplete,
      logout,
      updateProfile,
      fetchProfile,
      loginWithEmail,
      signupWithEmail,
      loginAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};
