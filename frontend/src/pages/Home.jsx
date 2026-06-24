import { useAuth } from '../context/AuthContext';
import { Zap, Target, Brain, Grid, Eye, BookOpen, Flag, Gamepad2, ArrowRight, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home({ setCurrentView, setSelectedGameId, onViewProfile }) {
  const { client, isAuthenticated } = useAuth();

  const handlePlay = (gameId) => {
    if (!isAuthenticated) {
      setCurrentView('login');
      return;
    }
    setSelectedGameId(gameId);
    setCurrentView('play');
  };

  const getPersonalBestText = (gameId) => {
    if (!client || !client.scores) return '-';
    
    const score = client.scores[gameId];
    if (gameId === 'reaction') {
      return score > 0 ? `${score} ms` : '-';
    }
    if (gameId === 'aimTrainer') {
      return score.score > 0 ? `${(score.score / 100).toFixed(2)} tps` : '-';
    }
    if (gameId === 'wawasanIndonesia') {
      return score > 0 ? `${score} Poin` : '-';
    }
    return score > 0 ? `Lvl ${score}` : '-';
  };

  const tests = [
    {
      id: 'reaction',
      title: 'Reaction Time',
      icon: <Zap size={24} className="text-zinc-950" />,
      desc: 'Uji kecepatan refleks visual Anda dalam milidetik (ms).',
      color: 'hsl(45, 95%, 50%)'
    },
    {
      id: 'aimTrainer',
      title: 'Aim Trainer',
      icon: <Target size={24} className="text-zinc-950" />,
      desc: 'Klik 30 target secepat dan seakurat mungkin.',
      color: 'hsl(190, 95%, 45%)'
    },
    {
      id: 'numberMemory',
      title: 'Number Memory',
      icon: <Brain size={24} className="text-zinc-950" />,
      desc: 'Mengingat deretan angka panjang yang bertambah tiap level.',
      color: 'hsl(25, 85%, 50%)'
    },
    {
      id: 'sequenceMemory',
      title: 'Sequence Memory',
      icon: <Grid size={24} className="text-zinc-950" />,
      desc: 'Ingat dan ulangi pola grid kotak menyala yang bertambah panjang.',
      color: 'hsl(210, 85%, 50%)'
    },
    {
      id: 'visualMemory',
      title: 'Visual Memory',
      icon: <Eye size={24} className="text-zinc-950" />,
      desc: 'Ingat lokasi kotak yang menyala pada grid dinamis.',
      color: 'hsl(142, 70%, 45%)'
    },
    {
      id: 'verbalMemory',
      title: 'Verbal Memory',
      icon: <BookOpen size={24} className="text-zinc-950" />,
      desc: 'Tebak apakah kata yang muncul baru atau pernah terlihat.',
      color: 'hsl(200, 95%, 45%)'
    },
    {
      id: 'wawasanIndonesia',
      title: 'Wawasan Indonesia',
      icon: <Flag size={24} className="text-zinc-950" />,
      desc: 'Uji pengetahuan Anda tentang sejarah, budaya, dan geografi Indonesia.',
      color: 'hsl(346, 80%, 50%)',
      gridClass: 'col-span-2'
    },
    {
      id: 'funModes',
      title: 'Fun Game Modes',
      icon: <Gamepad2 size={24} className="text-zinc-950" />,
      desc: 'Mainkan kuis Zombie Simulator, kepribadian NPC, dan ke-Indonesia-an.',
      color: 'hsl(150, 80%, 40%)',
      gridClass: 'col-span-1'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-8 bg-transparent text-zinc-900 overflow-visible">
      
      {/* Hero / Welcome Panel */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="w-full glass-panel p-8 md:p-10 bg-amber-300 flex flex-col md:flex-row gap-8 mb-12 items-center justify-between border-zinc-950 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 opacity-5 font-black text-[140px] select-none pointer-events-none translate-x-12 -translate-y-12">
          NUSA
        </div>
        <div className="flex-1 text-left max-w-xl relative z-10">
          <span className="badge bg-white text-zinc-950 border-[2.5px] border-zinc-950 font-black px-3 py-1.5 mb-4 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] tracking-wide">
            HUMAN BENCHMARK INDONESIA
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tight leading-none mb-4 mt-2">
            Uji Otakmu. Buktikan Ke-Indonesia-anmu!
          </h1>
          <p className="text-zinc-800 text-sm md:text-base font-bold leading-relaxed mb-6">
            NUSA-BENCH adalah platform kognitif terintegrasi untuk menguji refleks visual, memori jangka pendek, dan pemahaman budaya Nusantara secara real-time.
          </p>
          {!isAuthenticated && (
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView('login')} 
              className="btn btn-primary flex items-center gap-2 group"
            >
              <span>Mulai Daftarkan Username</span>
              <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>

        {/* User Card (If logged in) */}
        {isAuthenticated && client ? (
          <div className="w-full md:w-[340px] border-[3px] border-zinc-950 p-6 bg-white flex flex-col gap-4 shadow-[5px_5px_0px_0px_rgba(12,10,9,1)] rounded-xl relative z-10">
            <div 
              onClick={() => onViewProfile(client.username)}
              className="flex items-center gap-4 cursor-pointer hover:bg-zinc-50 p-2 -m-2 rounded-lg transition-all duration-150"
              title="Lihat Detail Profil Otak Anda"
            >
              <span className="h-12 w-12 rounded-xl bg-orange-100 border-[2.5px] border-zinc-950 flex items-center justify-center font-black text-xl text-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] select-none">
                {client.avatar || '🧠'}
              </span>
              <div className="text-left">
                <h3 className="font-black text-zinc-950 text-base leading-tight">{client.username}</h3>
                <span className="badge bg-orange-500 text-white text-[9px] font-black tracking-wider py-0.5 px-2 mt-1.5 shadow-none border-zinc-950">
                  Level {client.level} — {client.levelName}
                </span>
              </div>
            </div>
            
            <div className="text-left">
              <div className="flex justify-between text-[10px] text-zinc-650 mb-1.5 font-black uppercase tracking-wider">
                <span>Total XP: {client.xp}</span>
                <span className="flex items-center gap-1 text-orange-600 font-extrabold">
                  <Star size={11} className="fill-current" /> Progres Kognitif
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-150 border-2 border-zinc-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full border-r-2 border-zinc-950" 
                  style={{ width: `${Math.min((client.xp / 2000) * 100, 100)}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-t-2 border-zinc-950 pt-4">
              <div className="text-left">
                <span className="text-zinc-500 block font-black uppercase tracking-wider text-[9px]">Game Dimainkan</span>
                <strong className="text-zinc-950 font-black text-xs">{client.gamesPlayed} kali</strong>
              </div>
              <div className="text-left">
                <span className="text-zinc-500 block font-black uppercase tracking-wider text-[9px]">Pencapaian</span>
                <strong className="text-orange-600 font-black text-xs">{client.achievements ? client.achievements.length : 0} Lencana</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-[320px] border-[3px] border-zinc-950 p-6 bg-white flex flex-col gap-3 shadow-[5px_5px_0px_0px_rgba(12,10,9,1)] rounded-xl relative z-10 text-center">
            <div className="flex justify-center gap-3 text-zinc-950 py-2">
              <Zap size={28} className="text-amber-500 fill-amber-500" />
              <Brain size={28} className="text-orange-500 fill-orange-200" />
              <Target size={28} className="text-teal-500" />
            </div>
            <h3 className="font-black text-zinc-950 text-sm uppercase tracking-wide">Bandingkan Skor Otakmu</h3>
            <p className="text-xs text-zinc-500 font-semibold leading-relaxed">Simpan pencapaian terbaikmu dan berkompetisi secara nasional di papan peringkat.</p>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentView('login')} 
              className="btn btn-accent w-full text-xs font-black"
            >
              <span>Masuk Sesi Kognitif</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Bento Grid Title */}
      <div className="border-t border-zinc-200/80 pt-10 mb-8 flex justify-between items-end">
        <div className="text-left">
          <h2 className="text-2xl font-black text-zinc-950 flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            <span>Uji Kemampuan Kognitif</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Pilih salah satu modul tes kognitif di bawah untuk menguji refleks dan memori Anda.</p>
        </div>
      </div>

      {/* Bento Grid Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {tests.map((test) => (
          <motion.div
            key={test.id}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
            className="glass-panel p-6 text-left flex flex-col justify-between min-h-[250px] bg-white cursor-pointer group"
            style={{
              gridColumn: test.gridClass?.includes('span-2') ? 'span 2' : 'span 1'
            }}
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div 
                  className="p-2.5 rounded-lg border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] inline-flex"
                  style={{ backgroundColor: test.color }}
                >
                  {test.icon}
                </div>

                {isAuthenticated && test.id !== 'funModes' && (
                  <span className="badge bg-white text-zinc-900 border-2 border-zinc-950 text-[10px] font-black py-0.5 px-2.5 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]">
                    PB: <strong className="text-orange-600 font-black">{getPersonalBestText(test.id)}</strong>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-zinc-950 mb-2 group-hover:text-orange-600 transition-colors">{test.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-medium">{test.desc}</p>
            </div>

            <button 
              onClick={() => handlePlay(test.id)}
              className="btn btn-secondary w-full gap-1.5 !min-h-[42px] text-xs font-black uppercase tracking-wider group-hover:bg-zinc-950 group-hover:text-white transition-colors"
            >
              <span>{test.id === 'funModes' ? 'Buka Pilihan' : 'Mulai Uji Otak'}</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 1024px) {
          .col-span-2 {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
