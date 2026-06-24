import { useAuth } from '../context/AuthContext';
import { Trophy, User, Gamepad2, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ currentView, setCurrentView, onViewProfile }) {
  const { client, isAuthenticated, logout } = useAuth();

  const handleNavClick = (view) => {
    setCurrentView(view);
  };

  return (
    <nav className="w-full bg-white border-b-[3px] border-zinc-950 py-4 px-6 flex justify-between items-center text-zinc-900 sticky top-0 z-50">
      
      {/* Brand Logo */}
      <div 
        onClick={() => handleNavClick('landing')}
        className="flex items-center gap-2 cursor-pointer font-heading font-black text-lg select-none tracking-tight text-zinc-950 border-[2.5px] border-zinc-950 bg-amber-400 px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(12,10,9,1)] transition-all duration-150 rounded-md"
      >
        <svg 
          className="w-5 h-5 text-zinc-950" 
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
        <span>NUSA-<span className="text-zinc-950 font-black decoration-wavy underline decoration-zinc-950 underline-offset-4">BENCH</span></span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-4">
        <button 
          onClick={() => handleNavClick('landing')}
          className={`px-3.5 py-2 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 cursor-pointer rounded-md border-[2.5px] border-zinc-950 transition-all duration-150 outline-none select-none ${
            currentView === 'landing' || currentView === 'play' 
              ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]' 
              : 'bg-white text-zinc-800 hover:bg-zinc-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
          }`}
        >
          <Gamepad2 size={14} strokeWidth={2.5} />
          <span>Uji Kognitif</span>
        </button>
        <button 
          onClick={() => handleNavClick('leaderboard')}
          className={`px-3.5 py-2 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 cursor-pointer rounded-md border-[2.5px] border-zinc-950 transition-all duration-150 outline-none select-none ${
            currentView === 'leaderboard' 
              ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]' 
              : 'bg-white text-zinc-800 hover:bg-zinc-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
          }`}
        >
          <Trophy size={14} strokeWidth={2.5} />
          <span>Peringkat</span>
        </button>
        {isAuthenticated && (
          <button 
            onClick={() => handleNavClick('profile')}
            className={`px-3.5 py-2 text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 cursor-pointer rounded-md border-[2.5px] border-zinc-950 transition-all duration-150 outline-none select-none ${
              currentView === 'profile' 
                ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]' 
                : 'bg-white text-zinc-800 hover:bg-zinc-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
            }`}
          >
            <User size={14} strokeWidth={2.5} />
            <span>Edit Profil</span>
          </button>
        )}
      </div>

      {/* Session Info / CTA */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onViewProfile(client.username)}
              className="px-3.5 py-2 rounded-md border-[2.5px] border-zinc-950 bg-white font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all duration-150 outline-none select-none text-zinc-800 hover:bg-zinc-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span className="text-sm select-none">{client?.avatar || '🧠'}</span>
              <span>{client?.username}</span>
            </button>
            <button 
              onClick={logout} 
              aria-label="Keluar Sesi"
              className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-2 rounded-md text-xs font-extrabold cursor-pointer border-[2.5px] border-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] hover:bg-red-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 outline-none select-none"
            >
              <LogOut size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => handleNavClick('login')} 
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-md text-xs uppercase tracking-wider font-black cursor-pointer border-[2.5px] border-zinc-950 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] hover:bg-orange-600 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-150 outline-none select-none"
          >
            <User size={14} strokeWidth={3} />
            <span>Daftar / Masuk</span>
          </button>
        )}
      </div>
    </nav>
  );
}
