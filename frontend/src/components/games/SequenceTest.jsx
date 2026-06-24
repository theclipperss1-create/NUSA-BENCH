import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Grid, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function SequenceTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | playing | userTurn | finished
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [activeSquare, setActiveSquare] = useState(null); // Index of lit square (0-8)
  const [personalBest, setPersonalBest] = useState(client?.scores?.sequenceMemory || 0);

  const timeoutRefs = useRef([]);

  useEffect(() => {
    return () => {
      // Clear all active timers on unmount
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const addTimeouts = (timers) => {
    timeoutRefs.current = [...timeoutRefs.current, ...timers];
  };

  const startTest = () => {
    setLevel(1);
    const firstSquare = Math.floor(Math.random() * 9);
    const initialSeq = [firstSquare];
    setSequence(initialSeq);
    setUserSequence([]);
    setGameState('playing');
    playSequence(initialSeq);
  };

  const playSequence = (seq) => {
    setGameState('playing');
    setUserSequence([]);
    
    // Play back sequence
    const timers = [];
    seq.forEach((squareIdx, i) => {
      // Turn on
      const onTimer = setTimeout(() => {
        setActiveSquare(squareIdx);
      }, i * 600 + 300);

      // Turn off
      const offTimer = setTimeout(() => {
        setActiveSquare(null);
        // On last square, hand control to user
        if (i === seq.length - 1) {
          setGameState('userTurn');
        }
      }, i * 600 + 700);

      timers.push(onTimer, offTimer);
    });
    addTimeouts(timers);
  };

  const handleSquareClick = (squareIdx) => {
    if (gameState !== 'userTurn') return;

    // Flash clicked square briefly
    setActiveSquare(squareIdx);
    setTimeout(() => {
      setActiveSquare(null);
    }, 150);

    const nextUserSeq = [...userSequence, squareIdx];
    setUserSequence(nextUserSeq);

    // Verify current click
    const currentIndex = nextUserSeq.length - 1;
    if (squareIdx === sequence[currentIndex]) {
      // Correct!
      if (nextUserSeq.length === sequence.length) {
        // Level completed!
        const nextLevel = level + 1;
        setLevel(nextLevel);
        const nextSeq = [...sequence, Math.floor(Math.random() * 9)];
        setSequence(nextSeq);
        
        // Wait 1 second before playing next sequence
        const waitTimer = setTimeout(() => {
          playSequence(nextSeq);
        }, 1000);
        addTimeouts([waitTimer]);
      }
    } else {
      // Incorrect! Game over
      setGameState('finished');
      handleFinish(level);
    }
  };

  const handleFinish = async (finalLevel) => {
    try {
      const res = await api.submitScore(client.username, 'sequenceMemory', finalLevel);
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
              <Grid size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Sequence Memory 🟦</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                Uji kemampuan memori spasial jangka pendek Anda. Perhatikan pola kotak yang menyala, lalu ulangi urutan kliknya dengan tepat.
              </p>
              <button onClick={startTest} className="btn btn-primary w-full max-w-xs">
                Mulai Uji Coba
              </button>
            </div>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'userTurn') && (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className={`text-xs font-black uppercase tracking-wider ${gameState === 'playing' ? 'text-orange-600' : 'text-zinc-650'}`}>
              {gameState === 'playing' ? 'Perhatikan pola...' : 'Ulangi pola sekarang!'}
            </div>
            
            {/* 3x3 Grid Board */}
            <div className="grid grid-cols-3 gap-3 w-[280px] h-[280px] mx-auto p-3.5 bg-zinc-50 border-[3px] border-zinc-950 rounded-xl shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]">
              {[...Array(9)].map((_, idx) => {
                const isActive = activeSquare === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSquareClick(idx)}
                    className={`
                      aspect-square rounded-lg transition-all duration-100
                      ${isActive 
                        ? 'bg-orange-500 border-2 border-zinc-950 shadow-[1px_1px_0px_0px_rgba(12,10,9,1)] scale-95' 
                        : 'bg-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] hover:bg-zinc-100'
                      }
                      ${gameState === 'userTurn' ? 'cursor-pointer active:scale-90 active:translate-x-[1px] active:translate-y-[1px]' : 'cursor-default'}
                    `}
                  />
                );
              })}
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl select-none mx-auto">
              ✗
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-600">Salah Urutan! ❌</h3>
              <p className="text-xs text-zinc-400 mt-1">Skor tertinggi terkirim ke papan peringkat.</p>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 border-2 border-zinc-950 p-4 rounded-xl text-sm shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
              <span className="text-zinc-650 font-bold">Level Tertinggi:</span>
              <strong className="text-orange-655 text-lg font-black">Level {level}</strong>
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
