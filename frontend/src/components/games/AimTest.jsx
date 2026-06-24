import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Target, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function AimTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [targetCount, setTargetCount] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [totalClicks, setTotalClicks] = useState(0);
  const [personalBest, setPersonalBest] = useState(client?.scores?.aimTrainer?.score || 0);
  const [duration, setDuration] = useState(0);

  const startTimeRef = useRef(0);
  const playAreaRef = useRef(null);

  const spawnTarget = () => {
    // Random position from 10% to 90% to prevent targets spawning off-screen
    const nextX = Math.random() * 80 + 10;
    const nextY = Math.random() * 80 + 10;
    setTargetPos({ x: nextX, y: nextY });
  };

  const startTest = () => {
    setGameState('playing');
    setTargetCount(0);
    setTotalClicks(0);
    setDuration(0);
    spawnTarget();
    startTimeRef.current = performance.now();
  };

  const handleTargetClick = (e) => {
    e.stopPropagation(); // Prevent counting as miss
    setTotalClicks(prev => prev + 1);
    
    const nextCount = targetCount + 1;
    setTargetCount(nextCount);

    if (nextCount >= 30) {
      const endTime = performance.now();
      const durationSec = (endTime - startTimeRef.current) / 1000;
      setDuration(durationSec);
      setGameState('finished');
      handleFinish(durationSec);
    } else {
      spawnTarget();
    }
  };

  const handleMissClick = () => {
    if (gameState !== 'playing') return;
    setTotalClicks(prev => prev + 1);
  };

  const handleFinish = async (durationSec) => {
    const accuracy = Math.round((30 / totalClicks) * 100);
    const targetsPerSec = 30 / durationSec;
    const finalScore = Math.round(targetsPerSec * 100); // e.g. 7.50 targets/sec -> 750 score
    
    try {
      const res = await api.submitScore(client.username, 'aimTrainer', finalScore, accuracy);
      if (res.isNewPersonalBest) {
        setPersonalBest(finalScore);
        gooeyToast.success(`🏆 Rekor Baru! ${targetsPerSec.toFixed(2)} Target/Detik`);
      } else {
        gooeyToast.info(`Selesai! Skor Anda: ${targetsPerSec.toFixed(2)} Target/Detik`);
      }
      if (res.levelUp) {
        gooeyToast.success(`🎉 Naik Level! Anda sekarang Level ${res.profile.level} (${res.profile.levelName})`);
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error('Gagal menyimpan skor');
    }
  };

  // Target size decreases as user hits more targets
  const getTargetSize = () => {
    // Start at 52px, shrink down to 24px
    return Math.max(52 - Math.floor(targetCount * 0.9), 24);
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
          <span>Target: <strong className="text-zinc-800">{targetCount}/30</strong></span>
          {personalBest > 0 && (
            <span className="text-orange-600 flex items-center gap-1">
              <Trophy size={13} /> PB: <strong>{(personalBest / 100).toFixed(2)} tps</strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Testing Canvas */}
      {gameState === 'playing' ? (
        <div 
          ref={playAreaRef}
          onClick={handleMissClick}
          className="relative h-[400px] bg-zinc-950 border-[3px] border-zinc-950 rounded-2xl cursor-crosshair overflow-hidden mb-6 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]"
        >
          {/* Target */}
          <div 
            onClick={handleTargetClick}
            style={{
              position: 'absolute',
              left: `${targetPos.x}%`,
              top: `${targetPos.y}%`,
              width: `${getTargetSize()}px`,
              height: `${getTargetSize()}px`,
              transform: 'translate(-50%, -50%)',
              background: '#ea580c',
              border: '2px solid #000000',
              borderRadius: '50%',
              boxShadow: '3px 3px 0px 0px rgba(12,10,9,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            <div style={{ width: '6px', height: '6px', background: '#ffffff', borderRadius: '50%' }} />
          </div>
        </div>
      ) : (
        <div className="h-[400px] bg-zinc-50 border-[3px] border-zinc-950 rounded-2xl flex flex-col items-center justify-center p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]">
          {gameState === 'idle' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-lg border-2 border-zinc-950 bg-amber-400 text-zinc-950 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] select-none">
                <Target size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Aim Trainer 🎯</h3>
                <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                  Uji kecepatan refleks motorik dan akurasi klik Anda. Klik 30 target secepat mungkin.
                </p>
                <button onClick={startTest} className="btn btn-primary w-full max-w-xs">
                  Mulai Uji Coba
                </button>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="flex flex-col items-center gap-6 w-full">
              <h3 className="text-2xl font-bold text-zinc-950">Hasil Aim Trainer</h3>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="glass-panel p-4 bg-zinc-50 border-zinc-200/60 text-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">AKURASI</span>
                  <strong className="text-2xl font-black text-orange-600">
                    {Math.round((30 / totalClicks) * 100)}%
                  </strong>
                </div>
                
                <div className="glass-panel p-4 bg-zinc-50 border-zinc-200/60 text-center">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">TARGET/DETIK</span>
                  <strong className="text-2xl font-black text-zinc-800">
                    {duration > 0 ? (30 / duration).toFixed(2) : '0.00'} tps
                  </strong>
                </div>
              </div>

              <button onClick={startTest} className="btn btn-primary w-full max-w-xs gap-2">
                <RefreshCw size={15} />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'playing' && (
        <div className="text-left text-xs font-medium text-zinc-400">
          Tip: Hindari misclick! Setiap klik meleset akan menurunkan tingkat persentase akurasi akhir Anda.
        </div>
      )}

    </div>
  );
}
