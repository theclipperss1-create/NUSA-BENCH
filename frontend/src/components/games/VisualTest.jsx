import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Eye, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function VisualTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | memorizing | playing | finished
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3); // e.g. 3 for 3x3
  const [activeTiles, setActiveTiles] = useState([]); // indices of active tiles
  const [clickedTiles, setClickedTiles] = useState([]); // user clicked tiles
  const [mistakes, setMistakes] = useState(0);
  const [personalBest, setPersonalBest] = useState(client?.scores?.visualMemory || 0);

  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getGridConfig = (lvl) => {
    // Return { size, count } representing grid N x N and active tiles count
    if (lvl === 1) return { size: 3, count: 3 };
    if (lvl === 2) return { size: 3, count: 4 };
    if (lvl === 3) return { size: 4, count: 5 };
    if (lvl === 4) return { size: 4, count: 6 };
    if (lvl === 5) return { size: 5, count: 7 };
    if (lvl === 6) return { size: 5, count: 8 };
    if (lvl === 7) return { size: 6, count: 9 };
    return { size: 6, count: Math.min(9 + (lvl - 7), 18) };
  };

  const startLevel = (lvl) => {
    const { size, count } = getGridConfig(lvl);
    setGridSize(size);
    setClickedTiles([]);
    setMistakes(0);
    setGameState('memorizing');

    // Generate random active tiles
    const totalTiles = size * size;
    const tiles = [];
    while (tiles.length < count) {
      const rand = Math.floor(Math.random() * totalTiles);
      if (!tiles.includes(rand)) {
        tiles.push(rand);
      }
    }
    setActiveTiles(tiles);

    // Hide tiles after 1.2s
    timeoutRef.current = setTimeout(() => {
      setGameState('playing');
    }, 1200);
  };

  const startTest = () => {
    setLevel(1);
    startLevel(1);
  };

  const handleTileClick = (idx) => {
    if (gameState !== 'playing') return;
    if (clickedTiles.includes(idx)) return; // Already clicked

    const isCorrect = activeTiles.includes(idx);
    
    if (isCorrect) {
      const nextClicked = [...clickedTiles, idx];
      setClickedTiles(nextClicked);

      // Check if level completed (all correct tiles clicked)
      if (nextClicked.length === activeTiles.length) {
        setGameState('memorizing'); // Deactivate clicks
        gooeyToast.success("Bagus!");
        
        timeoutRef.current = setTimeout(() => {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          startLevel(nextLevel);
        }, 800);
      }
    } else {
      // Wrong tile! Count mistake
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      
      if (nextMistakes >= 3) {
        // Too many mistakes, game over!
        setGameState('finished');
        handleFinish(level);
      }
    }
  };

  const handleFinish = async (finalLevel) => {
    try {
      const res = await api.submitScore(client.username, 'visualMemory', finalLevel);
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
          <span>Kesalahan: <strong className={mistakes > 0 ? 'text-red-500' : 'text-zinc-800'}>{mistakes}/3</strong></span>
          {personalBest > 0 && (
            <span className="text-orange-600 flex items-center gap-1">
              <Trophy size={13} /> PB: <strong>Level {personalBest}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="min-h-[340px] flex flex-col justify-center items-center p-4">
        
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-lg border-2 border-zinc-950 bg-amber-400 text-zinc-950 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] select-none">
              <Eye size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Visual Memory 🔲</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                Uji kemampuan memori visual jangka pendek Anda. Ingat letak kotak yang berwarna, lalu klik posisinya kembali dengan tepat.
              </p>
              <button onClick={startTest} className="btn btn-primary w-full max-w-xs">
                Mulai Uji Coba
              </button>
            </div>
          </div>
        )}

        {(gameState === 'memorizing' || gameState === 'playing') && (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className={`text-xs font-black uppercase tracking-wider ${gameState === 'memorizing' ? 'text-orange-655' : 'text-zinc-650'}`}>
              {gameState === 'memorizing' ? 'Ingat posisi kotak...' : 'Klik posisi kotak!'}
            </div>

            {/* Dynamic Grid Board */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '8px',
                width: '300px',
                height: '300px',
              }}
              className="mx-auto p-3.5 bg-zinc-50 border-[3px] border-zinc-950 rounded-xl shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]"
            >
              {[...Array(gridSize * gridSize)].map((_, idx) => {
                const isShownActive = gameState === 'memorizing' && activeTiles.includes(idx);
                const isCorrectClicked = gameState === 'playing' && activeTiles.includes(idx) && clickedTiles.includes(idx);
                const isClicked = clickedTiles.includes(idx);
                const isIncorrectClicked = gameState === 'playing' && isClicked && !activeTiles.includes(idx);

                let bgClass = 'bg-white hover:bg-zinc-100 border-2 border-zinc-950 shadow-[1px_1px_0px_0px_rgba(12,10,9,1)]';

                if (isShownActive || isCorrectClicked) {
                  bgClass = 'bg-orange-500 border-2 border-zinc-950 shadow-[1px_1px_0px_0px_rgba(12,10,9,1)] scale-95';
                } else if (isIncorrectClicked) {
                  bgClass = 'bg-red-500 border-2 border-zinc-950 shadow-[1px_1px_0px_0px_rgba(12,10,9,1)] scale-95';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleTileClick(idx)}
                    className={`
                      aspect-square rounded-md transition-all duration-100
                      ${bgClass}
                      ${gameState === 'playing' ? 'cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none' : 'cursor-default'}
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
              <h3 className="text-xl font-bold text-red-600">Terlalu banyak kesalahan! ❌</h3>
              <p className="text-xs text-zinc-400 mt-1">Memori visual terputus. Skor terkirim ke papan peringkat.</p>
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
