import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiInstance = axios.create({
  baseURL: API_URL,
});

// Axios interceptor to dynamically inject the JWT token (local or Supabase)
apiInstance.interceptors.request.use(async (config) => {
  const localSessionStr = localStorage.getItem('local_auth_session');
  if (localSessionStr) {
    try {
      const localSession = JSON.parse(localSessionStr);
      if (localSession?.access_token) {
        config.headers.Authorization = `Bearer ${localSession.access_token}`;
        return config;
      }
    } catch (e) {
      console.error('Error parsing local auth session:', e);
    }
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Achievement specifications
const ACHIEVEMENTS_LIST = [
  { id: "reaction_flash", name: "Reaction Flash ⚡", desc: "Reaction time kurang dari 150ms", icon: "⚡" },
  { id: "aim_sniper", name: "Jago Tembak 🎯", desc: "Akurasi Aim Trainer lebih dari 95%", icon: "🎯" },
  { id: "number_king", name: "Memory King 🧠", desc: "Level Number Memory mencapai 12+", icon: "🧠" },
  { id: "wawasan_expert", name: "Ahli Nusantara 🇮🇩", desc: "Skor Wawasan Indonesia mencapai 90%+", icon: "🇮🇩" },
  { id: "on_fire", name: "On Fire 🔥", desc: "Memainkan total 10 game atau lebih", icon: "🔥" },
  { id: "garuda_champ", name: "Ksatria Garuda 🦅", desc: "Selesaikan semua 7 jenis tes minimal sekali", icon: "🦅" },
  { id: "intellect_star", name: "Bintang Nusantara ⭐", desc: "Total XP melampaui 2.000 XP", icon: "⭐" },
];

export const api = {
  // Profiles
  getProfile: async () => {
    const res = await apiInstance.get('/profiles/me');
    return res.data;
  },

  getProfileByUsername: async (username) => {
    const res = await apiInstance.get(`/profiles/user/${username}`);
    return res.data;
  },

  updateProfile: async (updatedData) => {
    const res = await apiInstance.put('/profiles/me', {
      full_name: updatedData.full_name,
      username: updatedData.username
    });
    return res.data;
  },

  // Scores submission
  submitScore: async (username, testId, score, accuracy = null) => {
    let gameType = testId;
    if (testId === 'reaction') gameType = 'reaction_time';
    else if (testId === 'aimTrainer') gameType = 'aim_trainer';
    else if (testId === 'numberMemory') gameType = 'number_memory';
    else if (testId === 'sequenceMemory') gameType = 'sequence_memory';
    else if (testId === 'visualMemory') gameType = 'visual_memory';
    else if (testId === 'verbalMemory') gameType = 'verbal_memory';
    else if (testId === 'wawasanIndonesia') gameType = 'wawasan_indonesia';

    const additionalData = {};
    if (testId === 'aimTrainer') {
      additionalData.accuracy = accuracy;
    }

    try {
      const res = await apiInstance.post('/scores', {
        game_type: gameType,
        score_value: score,
        additional_data: additionalData
      });
      return {
        profile: res.data.profile || null,
        xpGained: res.data.xpGained || 50,
        isNewPersonalBest: res.data.isNewPersonalBest || true,
        levelUp: res.data.levelUp || false
      };
    } catch (err) {
      console.error('Failed to submit score to backend:', err);
      return { xpGained: 0, isNewPersonalBest: false, levelUp: false };
    }
  },

  // Leaderboards
  getLeaderboards: async () => {
    const types = [
      { key: 'reaction', apiName: 'reaction_time' },
      { key: 'aimTrainer', apiName: 'aim_trainer' },
      { key: 'numberMemory', apiName: 'number_memory' },
      { key: 'sequenceMemory', apiName: 'sequence_memory' },
      { key: 'visualMemory', apiName: 'visual_memory' },
      { key: 'verbalMemory', apiName: 'verbal_memory' },
      { key: 'wawasanIndonesia', apiName: 'wawasan_indonesia' }
    ];

    try {
      const results = await Promise.all(
        types.map(t => apiInstance.get(`/scores/leaderboard/${t.apiName}`).catch(() => ({ data: { data: [] } })))
      );
      const leaderboards = {};
      types.forEach((t, i) => {
        const backendList = results[i].data.data || [];
        leaderboards[t.key] = backendList.map(item => ({
          username: item.profiles?.username || 'Pemain',
          score: item.score_value,
          date: item.created_at
        }));
      });
      return leaderboards;
    } catch (err) {
      console.error('Failed to fetch leaderboards:', err);
      return {};
    }
  },

  getAchievementsList: () => {
    return ACHIEVEMENTS_LIST;
  },

  login: async (email, password) => {
    const res = await apiInstance.post('/auth/login', { email, password });
    return res.data;
  },

  signup: async (email, password, username, fullName) => {
    const res = await apiInstance.post('/auth/signup', { email, password, username, fullName });
    return res.data;
  }
};
