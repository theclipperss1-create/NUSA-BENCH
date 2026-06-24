import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Brain, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function NumberTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | memorizing | typing | result | finished
  const [level, setLevel] = useState(1);
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(0);
  const [personalBest, setPersonalBest] = useState(client?.scores?.numberMemory || 0);

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const generateNumber = (length) => {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
      // Don't start with 0
      if (i === 0) {
        result += characters.charAt(Math.floor(Math.random() * 9) + 1);
      } else {
        result += characters.charAt(Math.floor(Math.random() * 10));
      }
    }
    return result;
  };

  const getDigitCount = (lvl) => {
    // Follows progression: lvl 1 = 3, lvl 2 = 4, lvl 3 = 5, etc.
    return lvl + 2;
  };

  const startLevel = (lvl) => {
    const digits = getDigitCount(lvl);
    const num = generateNumber(digits);
    setNumber(num);
    setUserInput('');
    setGameState('memorizing');
    
    // Duration = digits * 0.8 seconds
    const displayDurationMs = digits * 800;
    setDuration(displayDurationMs);
    setTimeLeft(displayDurationMs);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(displayDurationMs - elapsed, 0);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setGameState('typing');
      }
    }, 30);
  };

  const startTest = () => {
    setLevel(1);
    startLevel(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameState !== 'typing') return;

    if (userInput.trim() === number) {
      setLevel(prev => prev + 1);
      setGameState('result');
    } else {
      setGameState('finished');
      handleFinish(level);
    }
  };

  const handleFinish = async (finalLevel) => {
    try {
      const res = await api.submitScore(client.username, 'numberMemory', finalLevel);
      if (res.isNewPersonalBest) {
        setPersonalBest(finalLevel);
        gooeyToast.success(`🏆 Rekor Baru! Level ${finalLevel}`);
      } else {
        gooeyToast.info(`Selesai! Anda mencapai Level ${finalLevel}`);
      }
      if (res.levelUp) {
        gooeyToast.success(`🎉 Naik Level! Anda sekarang Level ${res.profile.level} (${res.profile.levelName})`);
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error('Gagal menyimpan skor');
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
          <span>Level: <strong className="text-zinc-800">{level}</strong></span>
          {personalBest > 0 && (
            <span className="text-orange-600 flex items-center gap-1">
              <Trophy size={13} /> PB: <strong>Level {personalBest}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="min-h-[320px] flex flex-col justify-center items-center p-4">
        
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-lg border-2 border-zinc-950 bg-amber-400 text-zinc-950 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] select-none">
              <Brain size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Number Memory 🧠</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                Uji kemampuan ingatan visual jangka pendek Anda. Ingat deretan angka yang muncul, lalu ketik ulang dengan tepat.
              </p>
              <button onClick={startTest} className="btn btn-primary w-full max-w-xs">
                Mulai Uji Coba
              </button>
            </div>
          </div>
        )}

        {gameState === 'memorizing' && (
          <div className="w-full flex flex-col items-center gap-6">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ingat Angka Berikut:</span>
            <div className="text-5xl font-black text-zinc-950 tracking-widest break-all py-4 font-mono select-none">
              {number}
            </div>
            
            {/* Visual countdown bar */}
            <div className="w-full h-3 bg-zinc-100 border-2 border-zinc-950 rounded-full max-w-xs overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full border-r-2 border-zinc-950" 
                style={{ width: `${(timeLeft / duration) * 100}%` }}
              />
            </div>
          </div>
        )}

        {gameState === 'typing' && (
          <div className="w-full max-w-xs flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-950">Berapa angkanya tadi?</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                className="form-input text-center text-3xl font-bold font-mono tracking-widest py-3 h-[56px] focus:border-orange-600"
                placeholder="Ketik angka..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
                autoFocus
              />
              <button type="submit" className="btn btn-primary w-full">
                Kirim Jawaban
              </button>
            </form>
          </div>
        )}

        {gameState === 'result' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl select-none">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-600 mb-1">Jawaban Benar! 🎉</h3>
              <div className="text-3xl font-extrabold font-mono tracking-widest text-zinc-950 my-2 select-none">
                {number}
              </div>
              <button onClick={() => startLevel(level)} className="btn btn-primary w-full max-w-xs mt-2">
                Lanjut Level {level}
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl select-none mx-auto">
              ✗
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-600">Salah Tebak! ❌</h3>
              <p className="text-xs text-zinc-400 mt-1">Skor level tertinggi terkirim ke papan peringkat.</p>
            </div>
            
            <div className="flex flex-col gap-3 text-left bg-zinc-50 border-2 border-zinc-950 p-4 rounded-xl text-sm shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-650 font-bold">Angka yang benar:</span>
                <strong className="text-zinc-950 font-mono font-black break-all">{number}</strong>
              </div>
              <div className="flex justify-between border-b border-zinc-200 pb-2">
                <span className="text-zinc-650 font-bold">Jawaban Anda:</span>
                <strong className="text-red-500 font-mono font-black break-all">{userInput || '(kosong)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-650 font-bold">Level Tercapai:</span>
                <strong className="text-orange-655 font-black text-sm">Level {level}</strong>
              </div>
            </div>

            <button onClick={startTest} className="btn btn-primary w-full gap-2">
              <RefreshCw size={15} />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
