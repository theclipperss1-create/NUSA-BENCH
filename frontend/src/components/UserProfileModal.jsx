import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { X, Award, BarChart2, Star, CheckCircle2, Trophy, Clock, Target, Grid, Brain, Eye, BookOpen, Flag } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function UserProfileModal({ username, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await api.getProfileByUsername(username);
        if (res && res.data) {
          setProfile(res.data);
        } else {
          gooeyToast.error('Profil tidak ditemukan');
          onClose();
        }
      } catch (err) {
        console.error(err);
        gooeyToast.error('Gagal mengambil data profil');
        onClose();
      } finally {
        setLoading(false);
      }
    }
    if (username) {
      loadProfile();
    }
  }, [username, onClose]);

  if (!username) return null;

  // Calculate dynamic levels and names
  const getLevelInfo = (xp) => {
    let level = 1;
    let name = "Otak Baru 🧠";
    if (xp >= 15000) { level = 8; name = "Legenda Nusantara 👑"; }
    else if (xp >= 8000) { level = 7; name = "Cendikiawan Agung 🦉"; }
    else if (xp >= 4000) { level = 6; name = "Pakar Nusantara 🎓"; }
    else if (xp >= 2000) { level = 5; name = "Jenius Lokal ⭐"; }
    else if (xp >= 1200) { level = 4; name = "Cendikiawan 📚"; }
    else if (xp >= 600) { level = 3; name = "Pelajar Nusantara 🇮🇩"; }
    else if (xp >= 200) { level = 2; name = "Pikir Kreatif 💡"; }
    return { level, name };
  };

  const getPersonalBestValue = (scoresObj, key) => {
    if (!scoresObj) return null;
    const scoreVal = scoresObj[key];
    if (scoreVal === undefined || scoreVal === null || scoreVal <= 0) return null;
    return scoreVal;
  };

  // Extract cognitive profile scores based on rules (from 0 to 100)
  const calculateCognitiveMetrics = (profileData) => {
    if (!profileData || !profileData.scores) {
      return { refleks: 0, memori: 0, fokus: 0, logika: 0, wawasan: 0 };
    }
    const scores = profileData.scores;

    // 1. Refleks (Reaction Time - lower is better, Aim Trainer tps - higher is better)
    let refleks = 0;
    const rx = scores.reaction;
    if (rx && rx > 0) {
      refleks += Math.max(0, Math.min(100, Math.round(((400 - rx) / 250) * 100)));
    }
    const aim = scores.aimTrainer?.score;
    if (aim && aim > 0) {
      refleks += Math.max(0, Math.min(100, Math.round((aim / 500) * 100)));
    }
    refleks = refleks ? Math.round(refleks / (rx && aim ? 2 : 1)) : 50;

    // 2. Memori (Average of memory tests levels/scores)
    let memCount = 0;
    let memSum = 0;
    const numMem = scores.numberMemory;
    if (numMem && numMem > 0) {
      memSum += Math.min(100, Math.round((numMem / 15) * 100));
      memCount++;
    }
    const seqMem = scores.sequenceMemory;
    if (seqMem && seqMem > 0) {
      memSum += Math.min(100, Math.round((seqMem / 15) * 100));
      memCount++;
    }
    const visMem = scores.visualMemory;
    if (visMem && visMem > 0) {
      memSum += Math.min(100, Math.round((visMem / 15) * 100));
      memCount++;
    }
    const verbMem = scores.verbalMemory;
    if (verbMem && verbMem > 0) {
      memSum += Math.min(100, Math.round((verbMem / 80) * 100));
      memCount++;
    }
    const memori = memCount > 0 ? Math.round(memSum / memCount) : 50;

    // 3. Fokus (Aim Trainer accuracy and Sequence Memory)
    let fokus = 50;
    const aimAcc = scores.aimTrainer?.accuracy;
    if (aimAcc && aimAcc > 0) {
      fokus = Math.round(aimAcc);
    }

    // 4. Logika (Sequence + Visual memory logical parts)
    let logCount = 0;
    let logSum = 0;
    if (seqMem && seqMem > 0) {
      logSum += Math.min(100, Math.round((seqMem / 12) * 100));
      logCount++;
    }
    if (visMem && visMem > 0) {
      logSum += Math.min(100, Math.round((visMem / 12) * 100));
      logCount++;
    }
    const logika = logCount > 0 ? Math.round(logSum / logCount) : 50;

    // 5. Wawasan Nusantara
    const wawasanScore = scores.wawasanIndonesia;
    const wawasan = wawasanScore ? Math.min(100, Math.round((wawasanScore / 130) * 100)) : 40;

    return { refleks, memori, fokus, logika, wawasan };
  };

  const getCognitiveLabel = (value) => {
    if (value >= 85) return 'Sangat Tajam ⚡';
    if (value >= 70) return 'Tinggi 🔥';
    if (value >= 50) return 'Baik 👍';
    return 'Latihan Lagi 🌱';
  };

  const brainTypeLabel = (metrics) => {
    const { refleks, memori, fokus, logika, wawasan } = metrics;
    if (wawasan >= 80 && refleks >= 80) return "KSATRIA GARUDA KILAT 🦅";
    if (memori >= 80 && logika >= 80) return "CENDIKIAWAN NUSANTARA 🧠";
    if (refleks >= 80) return "REFLEKS MACAN KEMAYORAN ⚡";
    if (wawasan >= 80) return "BUDAWAN PARIPURNA 🇮🇩";
    if (fokus >= 80) return "PENEMBAK JITU SUMATERA 🎯";
    return "ANALIS NUSANTARA ASLI 🔎";
  };

  const achievementsSpec = api.getAchievementsList();

  const userLevel = profile ? getLevelInfo(profile.xp) : { level: 1, name: 'Otak Baru' };
  const cognitiveMetrics = profile ? calculateCognitiveMetrics(profile) : { refleks: 0, memori: 0, fokus: 0, logika: 0, wawasan: 0 };
  const brainType = profile ? brainTypeLabel(cognitiveMetrics) : 'Menganalisis...';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-full max-w-[640px] border-[3px] border-zinc-950 bg-white p-6 md:p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(12,10,9,1)] relative z-10 overflow-y-auto max-h-[90vh] text-zinc-900"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 border-2 border-zinc-950 bg-red-100 hover:bg-red-200 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] rounded-md cursor-pointer transition-all outline-none"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {loading ? (
            <div className="py-12 text-center font-black text-zinc-950 text-base">
              <span className="inline-block animate-spin mr-2">🔄</span>
              <span>Memuat profil {username}...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6 text-left">
              {/* Header profile details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b-2 border-zinc-950">
                <span className="text-5xl select-none p-3.5 bg-amber-300 border-[3px] border-zinc-950 rounded-2xl shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]">
                  {profile.avatar_url || '🧠'}
                </span>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight uppercase leading-none">
                    {profile.username}
                  </h2>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">
                    {profile.full_name || 'Ksatria Nusa'}
                  </p>
                  
                  {/* Badge Row */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                    <span className="badge bg-orange-500 text-white shadow-none text-[9px] font-black border-zinc-950 px-2 py-0.5">
                      Lvl {userLevel.level} — {userLevel.name}
                    </span>
                    <span className="badge bg-zinc-950 text-white shadow-none text-[9px] font-black border-zinc-950 px-2 py-0.5">
                      {profile.games_played || 0} GAME
                    </span>
                  </div>
                </div>
              </div>

              {/* Bento sections grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Bento: Cognitive Radar Stats */}
                <div className="border-[3px] border-zinc-950 p-5 bg-zinc-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(12,10,9,1)] flex flex-col gap-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 pb-2 border-b border-zinc-200">
                    <BarChart2 size={16} strokeWidth={2.5} className="text-orange-500" />
                    <span>Profil Otak Kognitif</span>
                  </h3>
                  
                  <div className="flex flex-col gap-3.5 text-xs">
                    {/* Refleks */}
                    <div>
                      <div className="flex justify-between font-bold mb-1.5">
                        <span className="text-zinc-700">Refleks ⚡</span>
                        <span className="text-zinc-950 font-black">{cognitiveMetrics.refleks} ({getCognitiveLabel(cognitiveMetrics.refleks)})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 border-r-2 border-zinc-950 rounded-full" style={{ width: `${cognitiveMetrics.refleks}%` }} />
                      </div>
                    </div>

                    {/* Memori */}
                    <div>
                      <div className="flex justify-between font-bold mb-1.5">
                        <span className="text-zinc-700">Memori 🧠</span>
                        <span className="text-zinc-950 font-black">{cognitiveMetrics.memori} ({getCognitiveLabel(cognitiveMetrics.memori)})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 border-r-2 border-zinc-950 rounded-full" style={{ width: `${cognitiveMetrics.memori}%` }} />
                      </div>
                    </div>

                    {/* Fokus */}
                    <div>
                      <div className="flex justify-between font-bold mb-1.5">
                        <span className="text-zinc-700">Fokus 👁️</span>
                        <span className="text-zinc-950 font-black">{cognitiveMetrics.fokus} ({getCognitiveLabel(cognitiveMetrics.fokus)})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 border-r-2 border-zinc-950 rounded-full" style={{ width: `${cognitiveMetrics.fokus}%` }} />
                      </div>
                    </div>

                    {/* Logika */}
                    <div>
                      <div className="flex justify-between font-bold mb-1.5">
                        <span className="text-zinc-700">Logika 🔍</span>
                        <span className="text-zinc-950 font-black">{cognitiveMetrics.logika} ({getCognitiveLabel(cognitiveMetrics.logika)})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 border-r-2 border-zinc-950 rounded-full" style={{ width: `${cognitiveMetrics.logika}%` }} />
                      </div>
                    </div>

                    {/* Wawasan Nusantara */}
                    <div>
                      <div className="flex justify-between font-bold mb-1.5">
                        <span className="text-zinc-700">Wawasan ID 🇮🇩</span>
                        <span className="text-zinc-950 font-black">{cognitiveMetrics.wawasan} ({getCognitiveLabel(cognitiveMetrics.wawasan)})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-red-400 border-r-2 border-zinc-950 rounded-full" style={{ width: `${cognitiveMetrics.wawasan}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 p-3 border-2 border-zinc-950 bg-amber-100 rounded-lg text-[11px] font-black text-zinc-950 text-center uppercase tracking-wide">
                    Tipe Otak: {brainType}
                  </div>
                </div>

                {/* Right Bento: Personal Bests */}
                <div className="border-[3px] border-zinc-950 p-5 bg-zinc-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(12,10,9,1)] flex flex-col gap-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 pb-2 border-b border-zinc-200">
                    <Trophy size={16} strokeWidth={2.5} className="text-amber-500" />
                    <span>Skor Terbaik (PB)</span>
                  </h3>
                  
                  <div className="flex flex-col gap-2.5 text-xs font-bold text-zinc-700">
                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><Clock size={13} className="text-amber-500" /> Reaction Time</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'reaction') ? `${profile.scores.reaction} ms` : '-'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><Target size={13} className="text-teal-500" /> Aim Trainer</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'aimTrainer')?.score ? `${(profile.scores.aimTrainer.score / 100).toFixed(2)} tps` : '-'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><Brain size={13} className="text-orange-500" /> Number Memory</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'numberMemory') ? `Level ${profile.scores.numberMemory}` : '-'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><Grid size={13} className="text-blue-500" /> Sequence Memory</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'sequenceMemory') ? `Level ${profile.scores.sequenceMemory}` : '-'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><Eye size={13} className="text-emerald-500" /> Visual Memory</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'visualMemory') ? `Level ${profile.scores.visualMemory}` : '-'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><BookOpen size={13} className="text-cyan-500" /> Verbal Memory</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'verbalMemory') ? `${profile.scores.verbalMemory} Poin` : '-'}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 border border-zinc-300 rounded-md">
                      <span className="flex items-center gap-1.5"><Flag size={13} className="text-red-500" /> Wawasan Nusantara</span>
                      <strong className="text-zinc-950 font-black">
                        {getPersonalBestValue(profile.scores, 'wawasanIndonesia') ? `${profile.scores.wawasanIndonesia} Poin` : '-'}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Achievements Block */}
              <div className="border-[3px] border-zinc-950 p-5 bg-zinc-50 rounded-xl shadow-[4px_4px_0px_0px_rgba(12,10,9,1)]">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 pb-2.5 border-b border-zinc-200 mb-4">
                  <Award size={16} strokeWidth={2.5} className="text-orange-500" />
                  <span>Lencana Pencapaian ({profile.achievements ? profile.achievements.length : 0})</span>
                </h3>
                
                {(!profile.achievements || profile.achievements.length === 0) ? (
                  <p className="text-xs text-zinc-550 text-center font-bold py-2 uppercase">Belum ada lencana yang didapatkan.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {profile.achievements.map(achId => {
                      const spec = achievementsSpec.find(s => s.id === achId);
                      if (!spec) return null;
                      return (
                        <div key={achId} className="flex items-center gap-3 p-2 bg-white border-2 border-zinc-950 rounded-lg shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]">
                          <span className="text-xl p-1.5 bg-yellow-100 border border-zinc-300 rounded-md select-none">{spec.icon}</span>
                          <div>
                            <strong className="text-xs text-zinc-950 font-black block leading-tight">{spec.name}</strong>
                            <span className="text-[10px] text-zinc-550 block font-semibold leading-normal mt-0.5">{spec.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
