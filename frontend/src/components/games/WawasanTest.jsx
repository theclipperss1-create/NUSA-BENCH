import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { getRandomQuestions } from '../../services/wawasanData';
import { Flag, ArrowLeft, RefreshCw, Trophy, Clock, Check, X } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function WawasanTest({ onBack }) {
  const { client } = useAuth();
  const [gameState, setGameState] = useState('idle'); // idle | playing | result | finished
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [personalBest, setPersonalBest] = useState(client?.scores?.wawasanIndonesia || 0);

  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTest = () => {
    const qList = getRandomQuestions(10);
    setQuestions(qList);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setGameState('playing');
    startQuestionTimer();
  };

  const startQuestionTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(15);
    questionStartTimeRef.current = performance.now();
    
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAnswerSubmit(null); // Time out counts as incorrect
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerSubmit = (option) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOption(option);
    
    const currentQuestion = questions[currentIdx];
    const isCorrect = option === currentQuestion.answer;
    setIsAnswerCorrect(isCorrect);
    
    const timeTaken = (performance.now() - questionStartTimeRef.current) / 1000;
    
    let pointsGained = 0;
    if (isCorrect) {
      pointsGained += 10;
      setCorrectCount(prev => prev + 1);
      
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Streak bonus: 5 or more correct in a row = x2 points (+10 bonus)
      if (newStreak >= 5) {
        pointsGained += 10;
        gooeyToast.success("🔥 STREAK BONUS! +10 Poin");
      }

      // Speed bonus: answered in under 5 seconds
      if (timeTaken <= 5) {
        pointsGained += 5;
        gooeyToast.success("⚡ SPEED BONUS! +5 Poin");
      }
      
      setScore(prev => prev + pointsGained);
    } else {
      setStreak(0);
      // Penalty for incorrect answer
      setScore(prev => Math.max(prev - 3, 0));
    }

    setGameState('result');
  };

  const nextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      setGameState('finished');
      handleFinish(score);
    } else {
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      setGameState('playing');
      startQuestionTimer();
    }
  };

  const handleFinish = async (finalScore) => {
    try {
      const res = await api.submitScore(client.username, 'wawasanIndonesia', finalScore);
      if (res.isNewPersonalBest) {
        setPersonalBest(finalScore);
        gooeyToast.success(`🏆 Rekor Baru! Skor: ${finalScore} Poin`);
      } else {
        gooeyToast.info(`Selesai! Skor Akhir Anda: ${finalScore} Poin`);
      }
      if (res.levelUp) {
        gooeyToast.success(`🎉 Naik Level! Anda sekarang Level ${res.profile.level} (${res.profile.levelName})`);
      }
    } catch (err) {
      console.error(err);
      gooeyToast.error('Gagal menyimpan skor');
    }
  };

  const getResultRating = (points) => {
    if (points >= 120) return { label: 'PUTRA/PUTRI BANGSA 🦅', color: 'hsl(45, 95%, 50%)' };
    if (points >= 80) return { label: 'ANAK NUSANTARA 🇮🇩', color: 'hsl(142, 70%, 45%)' };
    if (points >= 50) return { label: 'ABANG/MPOK 👨‍🦱👩‍🦱', color: 'hsl(200, 95%, 45%)' };
    return { label: 'MANCANEGARA ✈️', color: 'hsl(346, 80%, 50%)' };
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
          {questions.length > 0 && gameState !== 'finished' && (
            <span>Soal: <strong className="text-zinc-950">{currentIdx + 1}/{questions.length}</strong></span>
          )}
          <span>Skor: <strong className="text-zinc-950">{score}</strong></span>
          {personalBest > 0 && (
            <span className="text-orange-600 flex items-center gap-1">
              <Trophy size={13} /> PB: <strong>{personalBest} Poin</strong>
            </span>
          )}
        </div>
      </div>

      <div className="min-h-[340px] flex flex-col justify-center items-center p-4">
        
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-lg border-2 border-zinc-950 bg-amber-400 text-zinc-950 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] select-none">
              <Flag size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1.5 text-zinc-950">Wawasan Indonesia 🇮🇩</h3>
              <p className="text-zinc-600 text-sm max-w-sm mx-auto mb-6 font-semibold">
                Uji pemahaman Anda tentang sejarah, geografi, budaya, kuliner, dan tokoh-tokoh penting di Indonesia.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-700 max-w-sm mx-auto mb-8 bg-zinc-50 border-2 border-zinc-950 p-4 rounded-xl text-left shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] font-bold">
                <div>🟢 <span className="text-zinc-950">Benar:</span> +10 Poin</div>
                <div>🔴 <span className="text-zinc-950">Salah:</span> -3 Poin</div>
                <div>⚡ <span className="text-zinc-950">Jawab Cepat (&lt;5d):</span> +5 Poin</div>
                <div>🔥 <span className="text-zinc-950">Streak (&ge;5 benar):</span> +10 Poin</div>
              </div>
              
              <button onClick={startTest} className="btn btn-primary w-full max-w-xs">
                Mulai Kuis
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <div className="w-full text-left flex flex-col gap-4">
            
            {/* Question Categories and Timer */}
            <div className="flex justify-between items-center pb-2 border-b-2 border-zinc-950">
              <span className="badge">
                Kategori: {questions[currentIdx].category}
              </span>
              <span className={`flex items-center gap-1.5 text-sm font-bold ${secondsLeft <= 5 ? 'text-red-650' : 'text-zinc-755'}`}>
                <Clock size={16} />
                <span>{secondsLeft}s</span>
              </span>
            </div>

            {/* Question Content */}
            <h3 className="text-lg font-bold text-zinc-950 leading-relaxed mb-4">
              {questions[currentIdx].question}
            </h3>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {questions[currentIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSubmit(opt)}
                  className="btn btn-secondary w-full justify-start text-left p-4 !min-h-[52px]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && questions.length > 0 && (
          <div className="w-full text-left flex flex-col gap-4">
            
            <div className={`flex items-center gap-2 text-lg font-bold ${isAnswerCorrect ? 'text-emerald-650' : 'text-red-650'}`}>
              {isAnswerCorrect ? (
                <><Check size={20} /> <span>JAWABAN BENAR!</span></>
              ) : (
                <><X size={20} /> <span>JAWABAN SALAH / WAKTU HABIS!</span></>
              )}
            </div>

            <p className="text-base font-bold text-zinc-950 mb-2 leading-relaxed">
              {questions[currentIdx].question}
            </p>

            <div className="bg-zinc-50 border-2 border-zinc-950 p-5 rounded-xl flex flex-col gap-4 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
              <div>
                <span className="text-xs font-bold text-zinc-550 uppercase block mb-1">Jawaban Yang Benar</span>
                <strong className="text-base text-emerald-650 font-bold">{questions[currentIdx].answer}</strong>
              </div>
              
              {selectedOption && selectedOption !== questions[currentIdx].answer && (
                <div className="border-t-2 border-zinc-950 pt-3">
                  <span className="text-xs font-bold text-zinc-550 uppercase block mb-1">Jawaban Anda</span>
                  <strong className="text-base text-red-500 font-bold">{selectedOption}</strong>
                </div>
              )}
            </div>

            {/* Next trigger */}
            <button onClick={nextQuestion} className="btn btn-primary w-full mt-4">
              {currentIdx + 1 >= questions.length ? 'Selesai & Lihat Skor' : 'Soal Berikutnya'}
            </button>

          </div>
        )}

        {gameState === 'finished' && (
          <div className="w-full max-w-xs flex flex-col gap-6">
            <div className="w-12 h-12 rounded-lg border-2 border-zinc-950 bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xl select-none mx-auto shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]">
              🏆
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold text-zinc-950">Kuis Selesai! 🎉</h3>
              <p className="text-xs text-zinc-500 mt-1">Skor wawasan kebangsaan Anda berhasil dicatat.</p>
            </div>

            <div className="flex flex-col gap-3 text-left bg-zinc-50 border-2 border-zinc-950 p-4 rounded-xl text-sm shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
              <div className="flex justify-between border-b-2 border-zinc-950 pb-2">
                <span className="text-zinc-500 font-bold">Benar:</span>
                <strong className="text-emerald-650 font-bold">{correctCount}/10 Soal</strong>
              </div>
              <div className="flex justify-between border-b-2 border-zinc-950 pb-2">
                <span className="text-zinc-500 font-bold">Skor Poin:</span>
                <strong className="text-orange-600 font-extrabold text-base">{score} Poin</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-bold">Kategori:</span>
                <strong className="text-zinc-950 font-black">{getResultRating(score).label}</strong>
              </div>
            </div>

            <button onClick={startTest} className="btn btn-primary w-full gap-2">
              <RefreshCw size={15} />
              <span>Kuis Ulang</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
