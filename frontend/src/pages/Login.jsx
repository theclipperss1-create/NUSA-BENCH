import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { gooeyToast } from 'goey-toast';
import { Mail, Lock, User, UserPlus, LogIn, ArrowRight } from 'lucide-react';

export default function Login({ setCurrentView }) {
  const { loading, loginWithEmail, signupWithEmail, loginAsGuest } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [formError, setFormError] = useState('');

  const handleGoogleLogin = async () => {
    const isPlaceholder = 
      !import.meta.env.VITE_SUPABASE_URL || 
      import.meta.env.VITE_SUPABASE_URL.includes('placeholder') || 
      !import.meta.env.VITE_SUPABASE_ANON_KEY || 
      import.meta.env.VITE_SUPABASE_ANON_KEY.startsWith('sb_publishable_') ||
      import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

    if (isPlaceholder) {
      try {
        setFormError('');
        const randId = Math.floor(Math.random() * 9000) + 1000;
        const email = `google_user_${randId}@gmail.com`;
        const username = `user_${randId}`;
        const fullName = `Google User ${randId}`;
        
        // Log in using local auth backend
        const signupPromise = signupWithEmail(email, 'GooglePassword123!', username, fullName);
        
        gooeyToast.promise(signupPromise, {
          loading: 'Menghubungkan ke Akun Google (Simulasi)...',
          success: 'Login Google (Simulasi) Berhasil! 🌐',
          error: (err) => err.message || 'Gagal masuk Google'
        });
        
        await signupPromise;
        if (setCurrentView) setCurrentView('landing');
      } catch (err) {
        setFormError(err.message || 'Gagal melakukan login Google');
      }
      return;
    }

    try {
      localStorage.removeItem('local_auth_session');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        console.error('Google Sign In OAuth Error:', error);
        gooeyToast.error(`OAuth Error: ${error.message}`);
      } else if (data?.url) {
        console.log('OAuth initiated, redirecting to:', data.url);
        window.location.assign(data.url);
      }
    } catch (err) {
      console.error('Google Sign In Error:', err);
      gooeyToast.error('Gagal menghubungkan dengan Google');
    }
  };

  const handleGuestLogin = async () => {
    try {
      setFormError('');
      const loginPromise = loginAsGuest();
      gooeyToast.promise(loginPromise, {
        loading: 'Membuat sesi tamu...',
        success: 'Berhasil masuk sebagai Tamu! 🎮',
        error: 'Gagal masuk sebagai Tamu.'
      });
      await loginPromise;
      if (setCurrentView) setCurrentView('landing');
    } catch (err) {
      setFormError(err.message || 'Gagal masuk sebagai tamu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Email dan password harus diisi');
      return;
    }

    if (authMode === 'signup' && !username) {
      setFormError('Username harus diisi');
      return;
    }

    try {
      if (authMode === 'login') {
        const loginPromise = loginWithEmail(email, password);
        gooeyToast.promise(loginPromise, {
          loading: 'Memverifikasi kredensial...',
          success: 'Selamat datang kembali! 👋',
          error: (err) => err.message || 'Gagal masuk'
        });
        await loginPromise;
      } else {
        const signupPromise = signupWithEmail(email, password, username, fullName);
        gooeyToast.promise(signupPromise, {
          loading: 'Membuat akun kognitif Anda...',
          success: 'Akun berhasil didaftarkan! 🎉',
          error: (err) => err.message || 'Gagal mendaftar'
        });
        await signupPromise;
      }
      if (setCurrentView) setCurrentView('landing');
    } catch (err) {
      setFormError(err.message || 'Terjadi kesalahan sistem');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-220px)] bg-transparent text-zinc-900 px-4 py-8">
      <div className="w-full max-w-[420px] glass-panel p-8 bg-white flex flex-col gap-6">
        
        {/* Logo minimalis NUSA-BENCH */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center text-white border-[3px] border-zinc-950 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
            <svg 
              className="w-8 h-8 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2c-3.8 0-7 3.2-7 7 0 2.8 1.8 5 4.5 6.2.8.3 1.5.8 1.5 1.8v1.5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V17c0-1 .7-1.5 1.5-1.8 2.7-1.2 4.5-3.4 4.5-6.2 0-3.8-3.2-7-7-7z" />
              <path d="M9 22h6" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight uppercase">
            {authMode === 'login' ? 'Masuk Sesi' : 'Daftar Baru'}
          </h2>
          <p className="text-xs text-zinc-550 mt-1.5 leading-relaxed max-w-xs mx-auto font-semibold">
            Uji otakmu, simpan pencapaian terbaikmu, dan buktikan ketangkasan kognitifmu.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-lg border-2 border-zinc-950">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setFormError(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-sm flex items-center justify-center gap-1.5 transition-all duration-150 outline-none select-none ${
              authMode === 'login' 
                ? 'bg-orange-500 text-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]' 
                : 'text-zinc-600 hover:text-zinc-900 bg-transparent'
            }`}
          >
            <LogIn size={13} strokeWidth={2.5} />
            <span>Masuk</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setFormError(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-sm flex items-center justify-center gap-1.5 transition-all duration-150 outline-none select-none ${
              authMode === 'signup' 
                ? 'bg-orange-500 text-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]' 
                : 'text-zinc-650 hover:text-zinc-900 bg-transparent'
            }`}
          >
            <UserPlus size={13} strokeWidth={2.5} />
            <span>Daftar</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {formError && (
            <div className="p-3 bg-red-55/70 border border-red-200/50 rounded-xl text-xs text-red-650 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0 animate-ping" />
              <span>{formError}</span>
            </div>
          )}

          {authMode === 'signup' && (
            <>
              <div className="form-group !mb-0">
                <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Username *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    placeholder="Contoh: gareng_solo"
                    className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  />
                </div>
              </div>

              <div className="form-group !mb-0">
                <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Nama Lengkap (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    disabled={loading}
                    placeholder="Contoh: Gareng Surakarta"
                    className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group !mb-0">
            <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Alamat Email *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail size={15} />
              </span>
              <input
                type="email"
                required
                disabled={loading}
                placeholder="email@anda.com"
                className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group !mb-0">
            <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Password *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock size={15} />
              </span>
              <input
                type="password"
                required
                disabled={loading}
                placeholder="Minimal 6 karakter"
                className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full gap-2 !py-2.5 !min-h-[42px] text-xs font-bold mt-2"
          >
            <span>{authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
            <ArrowRight size={13} />
          </button>
        </form>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Atau Masuk via</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Guest & Google Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className="btn btn-secondary w-full justify-center gap-2 !py-2 !min-h-[38px] text-xs border-zinc-200 hover:border-orange-500/20"
          >
            <span>🎮</span>
            <span>Masuk sebagai Tamu (Cepat)</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-secondary w-full justify-center gap-2 !py-2 !min-h-[38px] text-xs border-zinc-200"
          >
            <svg className="w-[15px] h-[15px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Akun Google</span>
          </button>
        </div>

      </div>
    </div>
  );
}
