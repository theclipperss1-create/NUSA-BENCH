import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Zap, AlertTriangle, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function ReactionTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | waiting | ready | early | result | finished
  const [attempts, setAttempts] = useState([]); // Array of response times (ms)
  const [currentAttemptTime, setCurrentAttemptTime] = useState(0);
  const [personalBest, setPersonalBest] = useState(client?.scores?.reaction || 0);

  const timeoutRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startTest = () => {
    setGameState('waiting');
    const delay = Math.random() * 3500 + 1500; // 1.5s to 5s
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleScreenClick = () => {
    if (gameState === 'idle') {
      startTest();
    } else if (gameState === 'waiting') {
      // Clicked too early!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'early') {
      startTest();
    } else if (gameState === 'ready') {
      const clickTime = performance.now();
      const elapsed = Math.round(clickTime - startTimeRef.current);
      const updatedAttempts = [...attempts, elapsed];
      setAttempts(updatedAttempts);
      setCurrentAttemptTime(elapsed);
      
      if (updatedAttempts.length >= 5) {
        setGameState('finished');
        handleFinish(updatedAttempts);
      } else {
        setGameState('result');
      }
    } else if (gameState === 'result') {
      startTest();
    }
  };

  const handleFinish = async (allAttempts) => {
    const sum = allAttempts.reduce((a, b) => a + b, 0);
    const average = Math.round(sum / allAttempts.length);
    
    try {
      const res = await api.submitScore(client.username, 'reaction', average);
      if (res.isNewPersonalBest) {
        setPersonalBest(average);
        gooeyToast.success(`🏆 Rekor Baru! Rata-rata: ${average}ms`);
      } else {
        gooeyToast.info(`Selesai! Rata-rata Anda: ${average}ms`);
      }
      if (res.levelUp) {
        gooeyToast.success(`🎉 Naik Level! Anda sekarang Level ${res.profile.level} (${res.profile.levelName})`);
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error('Gagal menyimpan skor');
    }
  };

  const resetTest = () => {
    setAttempts([]);
    setCurrentAttemptTime(0);
    setGameState('idle');
  };

  const getResultCategory = (time) => {
    if (time < 150) return { label: 'EXTREME ⚡', color: 'hsl(45, 95%, 50%)' };
    if (time < 200) return { label: 'SANGAT CEPAT 🟢', color: 'hsl(142, 70%, 45%)' };
    if (time < 250) return { label: 'NORMAL 🔵', color: 'hsl(200, 95%, 45%)' };
    if (time < 300) return { label: 'DI BAWAH RATA-RATA 🟡', color: 'hsl(35, 90%, 55%)' };
    return { label: 'LAMBAT 🔴', color: 'hsl(346, 80%, 50%)' };
  };

  const getScreenBgClass = () => {
    switch (gameState) {
      case 'waiting': return 'bg-red-500 text-white border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]';
      case 'ready': return 'bg-emerald-500 text-white border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]';
      case 'early': return 'bg-amber-400 text-zinc-950 border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]';
      case 'result':
      case 'finished': return 'bg-sky-500 text-white border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]';
      default: return 'bg-zinc-50 hover:bg-zinc-100 text-zinc-950 border-[3px] border-zinc-950 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]';
    }
  };

  return (
    <div className="glass-panel p-8 text-center max-w-2xl mx-auto flex flex-col gap-6">
      
      {/* Game Header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
        <button onClick={onBack} className="btn btn-secondary !py-1.5 !px-3 !min-h-[36px] text-xs">
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>
        <div className="flex gap-4 text-xs font-semibold text-zinc-500">
          <span>Percobaan: <strong className="text-zinc-800">{attempts.length}/5</strong></span>
          {personalBest > 0 && (
            <span className="text-orange-600 flex items-center gap-1">
              <Trophy size={13} /> PB: <strong>{personalBest}ms</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Clickable Testing Screen */}
      <div 
        onClick={handleScreenClick}
        className={`min-h-[300px] rounded-2xl border flex flex-col items-center justify-center cursor-pointer p-6 select-none transition-all duration-200 ${getScreenBgClass()}`}
      >
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <Zap size={32} className="fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Tes Waktu Reaksi ⚡</h3>
              <p className="text-zinc-500 text-sm max-w-sm">Klik atau tap di area ini untuk mulai.</p>
              <p className="text-xs text-zinc-400 mt-2 font-medium">
                Saat layar berubah menjadi hijau, klik secepat mungkin!
              </p>
            </div>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">TUNGGU...</h3>
            <p className="text-white/80 text-sm font-medium">Jangan klik dulu sampai layar berubah hijau!</p>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="text-center">
            <h3 className="text-4xl font-black text-white tracking-tight">KLIK SEKARANG!</h3>
          </div>
        )}

        {gameState === 'early' && (
          <div className="flex flex-col items-center gap-3">
            <AlertTriangle size={48} className="text-white" />
            <h3 className="text-2xl font-bold text-white">Terlalu cepat!</h3>
            <p className="text-white/90 text-sm font-medium">Klik sebelum hijau tidak dihitung. Tap untuk coba lagi.</p>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center">
            <h3 className="text-5xl font-black text-white tracking-tight mb-2">{currentAttemptTime} ms</h3>
            <p className="text-white/90 text-sm font-medium">Bagus! Tap untuk percobaan berikutnya.</p>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-white/90">Hasil Rata-rata</h3>
            <span className="text-6xl font-black text-white tracking-tight">
              {Math.round(attempts.reduce((a,b)=>a+b,0)/5)} ms
            </span>
            <span className="badge-secondary bg-white/10 text-white border-white/20 text-xs py-1 px-3.5 font-bold">
              Kategori: {getResultCategory(Math.round(attempts.reduce((a,b)=>a+b,0)/5)).label}
            </span>
            <p className="text-white/70 text-xs font-medium mt-2">
              Skor terunggah secara aman ke papan peringkat Anda.
            </p>
          </div>
        )}
      </div>

      {/* Attempt History List */}
      {attempts.length > 0 && (
        <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-2xl text-left">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Riwayat Percobaan</h4>
          <div className="flex gap-2 flex-wrap">
            {attempts.map((att, idx) => (
              <span key={idx} className="bg-white border border-zinc-200/80 px-3.5 py-1.5 rounded-xl text-xs text-zinc-700 font-semibold shadow-sm">
                Ke-{idx + 1}: <strong className="text-orange-600">{att}ms</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <button onClick={resetTest} className="btn btn-primary w-full max-w-xs mx-auto gap-2">
          <RefreshCw size={15} />
          <span>Ulangi Uji Coba</span>
        </button>
      )}

    </div>
  );
}
