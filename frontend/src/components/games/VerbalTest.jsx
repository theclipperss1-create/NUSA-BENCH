import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BookOpen, ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

const INDONESIAN_WORDS = [
  "nusantara", "garuda", "komodo", "rendang", "batik", "wayang", "angkasa", "gamelan", "keris", "candi",
  "merdeka", "proklamasi", "gotong", "royong", "musyawarah", "pancasila", "suku", "adat", "tari", "kain",
  "tenun", "songket", "monas", "sawah", "kopi", "rempah", "cengkeh", "pahlawan", "satria", "prajurit",
  "raja", "ratu", "patih", "prasasti", "angklung", "sasando", "tifa", "kolintang", "gong", "pantun",
  "legenda", "mitos", "pecel", "soto", "bakso", "rawon", "gudeg", "rujak", "tempe", "tahu",
  "bambu", "ombak", "melati", "padi", "kelapa", "hutan", "gunung", "sungai", "pantai", "pulau",
  "durian", "manggis", "rambutan", "salak", "nangka", "pisang", "singkong", "sagu", "jagung", "sambal",
  "benteng", "bahari", "katulistiwa", "maritim", "khatulistiwa", "bhinneka", "tunggal", "ika", "gapura", "joglo",
  "rakyat", "kedaulatan", "nusantara", "gotong-royong", "harmoni", "lestari", "pertiwi", "tanah", "air", "pusaka",
  "cendrawasih", "badak", "anoa", "tarsius", "maleo", "orangutan", "gajah", "harimau", "raflesia", "anggrek"
];

export default function VerbalTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | playing | finished
  const [score, setScore] = useState(0);
  const [seenWords, setSeenWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isWordNew, setIsWordNew] = useState(true); // Is the currently displayed word new?
  const [personalBest, setPersonalBest] = useState(client?.scores?.verbalMemory || 0);

  const pickNextWord = (currentSeen) => {
    // 50% chance to show a seen word (if we have seen words), 50% to show a new word
    const showSeen = currentSeen.length > 0 && Math.random() < 0.5;
    
    if (showSeen) {
      const randIdx = Math.floor(Math.random() * currentSeen.length);
      setCurrentWord(currentSeen[randIdx]);
      setIsWordNew(false);
    } else {
      // Pick a word not yet seen
      const unseen = INDONESIAN_WORDS.filter(w => !currentSeen.includes(w));
      
      if (unseen.length === 0) {
        // All words seen! End game with victory/max score
        gooeyToast.success("Luar biasa! Anda telah menghafal seluruh database kata!");
        setGameState('finished');
        handleFinish(score);
        return;
      }
      
      const randIdx = Math.floor(Math.random() * unseen.length);
      const chosenWord = unseen[randIdx];
      setCurrentWord(chosenWord);
      setIsWordNew(true);
    }
  };

  const startTest = () => {
    setScore(0);
    const initialSeen = [];
    setSeenWords(initialSeen);
    setGameState('playing');
    
    // Pick first word (must be new since seen is empty)
    const firstWord = INDONESIAN_WORDS[Math.floor(Math.random() * INDONESIAN_WORDS.length)];
    setCurrentWord(firstWord);
    setIsWordNew(true);
  };

  const handleAnswer = (answeredNew) => {
    const isCorrect = (answeredNew === isWordNew);
    
    if (isCorrect) {
      const nextScore = score + 1;
      setScore(nextScore);
      
      const updatedSeen = [...seenWords];
      if (isWordNew && !updatedSeen.includes(currentWord)) {
        updatedSeen.push(currentWord);
      }
      setSeenWords(updatedSeen);
      pickNextWord(updatedSeen);
    } else {
      setGameState('finished');
      handleFinish(score);
    }
  };

  const handleFinish = async (finalScore) => {
    try {
      const res = await api.submitScore(client.username, 'verbalMemory', finalScore);
      if (res.isNewPersonalBest) {
        setPersonalBest(finalScore);
        gooeyToast.success(`🏆 Rekor Baru! Skor: ${finalScore}`);
      } else {
        gooeyToast.info(`Selesai! Skor Anda: ${finalScore}`);
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
      <div className="flex justify-between items-center pb-4 border-b-2 border-zinc-950">
        <button onClick={onBack} className="btn btn-secondary !py-1.5 !px-3 !min-h-[36px] text-xs">
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>
        <div className="flex gap-4 text-xs font-semibold text-zinc-600">
          <span>Skor: <strong className="text-zinc-950">{score}</strong></span>
          {personalBest > 0 && (
            <span className="text-orange-600 flex items-center gap-1">
              <Trophy size={13} /> PB: <strong>{personalBest} Poin</strong>
            </span>
          )}
        </div>
      </div>

      <div className="min-h-[320px] flex flex-col justify-center items-center p-4">
        
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-lg border-2 border-zinc-950 bg-amber-400 text-zinc-950 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] select-none">
              <BookOpen size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Verbal Memory 📝</h3>
              <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-6">
                Uji memori verbal Anda. Kata-kata bahasa Indonesia akan muncul satu per satu. Klik **BARU** jika belum pernah muncul, atau **PERNAH** jika sudah pernah muncul sebelumnya.
              </p>
              <button onClick={startTest} className="btn btn-primary w-full max-w-xs">
                Mulai Uji Coba
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-sm flex flex-col gap-6">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Apakah kata berikut baru atau pernah muncul?</span>
            <div className="text-4xl font-extrabold text-zinc-950 uppercase tracking-wider py-4 font-mono select-none break-all">
              {currentWord}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleAnswer(true)} 
                className="btn btn-primary w-full"
              >
                KATA BARU
              </button>
              
              <button 
                onClick={() => handleAnswer(false)} 
                className="btn btn-secondary w-full"
              >
                PERNAH MUNCUL
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="w-12 h-12 rounded-full border-2 border-zinc-950 bg-red-100 text-red-650 flex items-center justify-center font-bold text-xl select-none mx-auto shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]">
              ✗
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-650">Salah Tebak! ❌</h3>
              <p className="text-xs text-zinc-500 mt-1">Ingatan kata Anda meleset. Skor telah terkirim ke papan peringkat.</p>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 border-2 border-zinc-950 p-4 rounded-xl text-sm shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
              <span className="text-zinc-700 font-bold">Skor Akhir:</span>
              <strong className="text-orange-600 text-lg font-black">{score} Poin</strong>
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
