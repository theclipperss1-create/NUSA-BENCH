import { useState } from 'react';
import { ArrowLeft, Shield, Heart, Zap, RefreshCw } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

// --- NPC Quiz Data ---
const NPC_QUESTIONS = [
  {
    q: "Apa reaksi Anda saat ditabrak orang asing tidak sengaja di pasar?",
    options: [
      { text: "Minta maaf duluan walaupun tidak bersalah", npc: 10 },
      { text: "Berdiam diri, mematung, lalu melanjutkan jalan", npc: 8 },
      { text: "Melirik tajam sambil berkata 'Hati-hati dong!'", npc: 2 },
      { text: "Menjatuhkan diri secara dramatis mencari perhatian", npc: 0 }
    ]
  },
  {
    q: "Menu makanan apa yang Anda pesan jika bingung di rumah makan baru?",
    options: [
      { text: "Nasi Goreng / Mie Goreng biasa", npc: 10 },
      { text: "Tanya pelayan 'Best seller-nya apa mbak?'", npc: 7 },
      { text: "Pilih menu random dengan nama paling aneh", npc: 2 },
      { text: "Minta nasi putih dan kecap saja", npc: 0 }
    ]
  },
  {
    q: "Bagaimana Anda menanggapi tren sosial media yang sedang viral?",
    options: [
      { text: "Ikut membagikan dan mengikuti tren tersebut", npc: 10 },
      { text: "Hanya melihat-lihat di timeline tanpa interaksi", npc: 8 },
      { text: "Mengkritik tren tersebut di kolom komentar", npc: 4 },
      { text: "Sama sekali tidak tahu dan tidak punya akun sosmed", npc: 0 }
    ]
  },
  {
    q: "Apa tanggapan Anda ketika ditanya kabar oleh kenalan biasa?",
    options: [
      { text: "Jawab 'Baik, alhamdulillah' lalu balik bertanya", npc: 10 },
      { text: "Senyum kaku dan mengangguk singkat", npc: 7 },
      { text: "Curhat panjang lebar masalah utang dan hidup", npc: 1 },
      { text: "Menjawab dengan teka-teki logika", npc: 0 }
    ]
  },
  {
    q: "Seberapa sering Anda memakai kaos polos hitam atau abu-abu dalam seminggu?",
    options: [
      { text: "Hampir setiap hari (seragam default hidup)", npc: 10 },
      { text: "2-3 kali seminggu", npc: 7 },
      { text: "Sangat jarang, saya suka baju bermotif ramai", npc: 2 },
      { text: "Saya hanya memakai batik tulis Nusantara", npc: 0 }
    ]
  }
];

// --- Seberapa Indonesia Quiz Data ---
const INDO_HABIT_QUESTIONS = [
  {
    q: "Apakah Anda makan mi instan dicampur nasi putih hangat?",
    options: [
      { text: "Wajib hukumnya! Belum kenyang kalau belum pakai nasi", score: 10 },
      { text: "Kadang-kadang kalau sedang lapar berat", score: 7 },
      { text: "Jarang sekali karena sadar kesehatan", score: 3 },
      { text: "Tidak pernah, aneh sekali rasanya", score: 0 }
    ]
  },
  {
    q: "Bagaimana cara Anda menunjuk ke arah lokasi yang cukup jauh?",
    options: [
      { text: "Menggunakan jempol tangan kanan ditekuk (Sopan tingkat tinggi)", score: 10 },
      { text: "Bibir dimonyongkan ke arah tujuan (Multitasking bibir)", score: 9 },
      { text: "Menunjuk dengan jari telunjuk tegak", score: 5 },
      { text: "Menggerakkan dagu atau melirik saja", score: 2 }
    ]
  },
  {
    q: "Apa yang Anda lakukan ketika kerupuk di stoples sudah mlempem (melempem)?",
    options: [
      { text: "Dimasukkan ke dalam kulkas agar garing kembali (Lifehack lokal)", score: 10 },
      { text: "Dijemur ulang di bawah terik matahari siang", score: 8 },
      { text: "Tetap dimakan sambil bersungut-sungut", score: 4 },
      { text: "Langsung dibuang ke tempat sampah", score: 0 }
    ]
  },
  {
    q: "Bagaimana respon Anda saat melihat tetangga membeli motor baru?",
    options: [
      { text: "Datang menyalami dan pura-pura tanya cicilan (Silaturahmi kepo)", score: 10 },
      { text: "Mengintip dari balik gorden jendela rumah", score: 7 },
      { text: "Biasa saja, mendoakan semoga berkah", score: 4 },
      { text: "Langsung membeli motor yang lebih mahal keesokannya", score: 1 }
    ]
  },
  {
    q: "Apa obat utama Anda ketika badan terasa masuk angin?",
    options: [
      { text: "Dikerok pakai koin seratus perak + minyak kayu putih (Garis merah)", score: 10 },
      { text: "Minum jamu tolak angin hangat", score: 8 },
      { text: "Tidur selimutan tebal tanpa dikerok", score: 4 },
      { text: "Pergi ke klinik spesialis penyakit dalam", score: 0 }
    ]
  }
];

// --- Zombie Simulator Data ---
const ZOMBIE_FRIENDS = [
  { id: "rt", name: "Pak RT", desc: "Karisma tinggi, birokrasi lancar, bawa stempel RT", combat: 20, survival: 70 },
  { id: "preman", name: "Preman Pasar", desc: "Kekuatan fisik luar biasa, bawa parang, temperamental", combat: 90, survival: 40 },
  { id: "dukun", name: "Mbah Dukun", desc: "Mistis, bisa bikin jimat, lari agak lambat", combat: 40, survival: 60 },
  { id: "gamers", name: "Gamer No-lep", desc: "Ahli taktik zombie game, begadang 24/7, fisik lemah", combat: 30, survival: 50 },
  { id: "satpam", name: "Polisi Komplek / Satpam", desc: "Bawa pentungan, disiplin, tahu rute kabur", combat: 75, survival: 65 }
];

const ZOMBIE_ITEMS = [
  { id: "sapulidi", name: "Sapu Lidi Kebas", desc: "Jangkauan sedang, damage geli-geli, berguna bersihkan markas" },
  { id: "indomie", name: "Indomie 1 Kardus", desc: "Meningkatkan moral tim, alat barter utama" },
  { id: "parang", name: "Parang Dapur Karatan", desc: "Senjata tajam jarak dekat, damage fatal" },
  { id: "gas3kg", name: "Tabung Gas Melon 3kg", desc: "Bisa dilempar dan diledakkan, sangat berat" },
  { id: "kayuputih", name: "Minyak Kayu Putih", desc: "Menyembuhkan gigitan gigitan gigitan... masuk angin" }
];

const ZOMBIE_STRATEGIES = [
  { id: "genteng", name: "Mengungsi di Atas Genteng Rumah Pak RT", desc: "Aman dari zombie darat, rawan kelaparan" },
  { id: "minimarket", name: "Barikade di Minimarket Terdekat (Kunci Pintu)", desc: "Suplai makanan melimpah, rawan didatangi kelompok lain" },
  { id: "barbar", name: "Menyerang Secara Barbar Pakai Bambu Runcing", desc: "Ksatria sejati, survival rate rendah namun berani" },
  { id: "rakit", name: "Membuat Rakit Kayu & Mengungsi ke Pulau Seribu", desc: "Aman di perairan, rawan badai lokal" }
];

export default function FunModes({ onBack }) {
  const [activeMode, setActiveMode] = useState(null); // null | npc | indo | zombie
  const [quizIdx, setQuizIdx] = useState(0);
  const [runningScore, setRunningScore] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);

  // Zombie selection states
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState('');

  const resetAll = () => {
    setActiveMode(null);
    setQuizIdx(0);
    setRunningScore(0);
    setSimulationResult(null);
    setSelectedFriends([]);
    setSelectedItems([]);
    setSelectedStrategy('');
  };

  const handleBackClick = () => {
    if (activeMode) {
      resetAll();
    } else if (onBack) {
      onBack();
    }
  };

  // NPC Quiz action
  const handleNpcAnswer = (npcWeight) => {
    const nextScore = runningScore + npcWeight;
    const nextIdx = quizIdx + 1;
    
    if (nextIdx >= NPC_QUESTIONS.length) {
      // Finished
      const finalNpcPct = Math.round((nextScore / (NPC_QUESTIONS.length * 10)) * 100);
      let label = "MANUSIA BEBAS KREATIF 🌀";
      let desc = "Pikiran Anda sangat orisinal dan tidak mudah terpengaruh tren massal. Anda adalah pahlawan utama cerita Anda.";
      
      if (finalNpcPct >= 80) {
        label = "DEFAULT CITY NPC 🤖";
        desc = "Anda adalah warga kota default. Respon Anda sangat terprediksi oleh algoritma. Hidup Anda aman tapi sangat template.";
      } else if (finalNpcPct >= 50) {
        label = "WARGA BIASA 👨‍🌾";
        desc = "Anda berada di batas aman. Kadang ikut tren default, kadang punya kepribadian nyeleneh.";
      }
      
      setSimulationResult({
        pct: finalNpcPct,
        label,
        desc
      });
      setQuizIdx(nextIdx);
    } else {
      setRunningScore(nextScore);
      setQuizIdx(nextIdx);
    }
  };

  // Seberapa Indonesia action
  const handleIndoAnswer = (questionScore) => {
    const nextScore = runningScore + questionScore;
    const nextIdx = quizIdx + 1;
    
    if (nextIdx >= INDO_HABIT_QUESTIONS.length) {
      const maxPossible = INDO_HABIT_QUESTIONS.length * 10;
      const pct = Math.round((nextScore / maxPossible) * 100);
      let label = "MANCANEGARA ✈️";
      let desc = "Anda mungkin berjiwa internasional atau jarang terpapar kearifan lokal. Waktunya kulineran angkringan!";
      
      if (pct >= 90) {
        label = "PUTRA/PUTRI BANGSA GARUDA 🦅";
        desc = "Darah Anda merah putih tulen. Kebiasaan Anda sangat Indonesia dan Anda hafal taktik bertahan hidup lokal.";
      } else if (pct >= 70) {
        label = "ANAK NUSANTARA ASLI 🇮🇩";
        desc = "Sangat lokal dan memahami budaya sehari-hari. Anda bangga makan mie instan pakai nasi.";
      } else if (pct >= 40) {
        label = "ABANG/MPOK KOTA 👨‍🦱👩‍🦱";
        desc = "Cukup Indonesia, namun gaya hidup kota modern mulai mengikis beberapa kebiasaan lama.";
      }

      setSimulationResult({
        pct,
        label,
        desc
      });
      setQuizIdx(nextIdx);
    } else {
      setRunningScore(nextScore);
      setQuizIdx(nextIdx);
    }
  };

  // Zombie Simulator trigger
  const runZombieSimulation = () => {
    if (selectedFriends.length !== 3 || selectedItems.length !== 3 || !selectedStrategy) {
      gooeyToast.error("Pilih tepat 3 Teman, 3 Barang, dan 1 Strategi.");
      return;
    }

    // Calculate survival rate
    const friendsStats = selectedFriends.map(id => ZOMBIE_FRIENDS.find(f => f.id === id));
    const avgCombat = friendsStats.reduce((acc, cur) => acc + cur.combat, 0) / 3;
    const avgSurvival = friendsStats.reduce((acc, cur) => acc + cur.survival, 0) / 3;

    let baseRate = (avgCombat * 0.4) + (avgSurvival * 0.6);

    // Items modifiers
    if (selectedItems.includes('indomie')) baseRate += 10; // Moral bonus
    if (selectedItems.includes('kayuputih')) baseRate += 5; // Healing
    if (selectedItems.includes('parang')) baseRate += 10; // Combat
    if (selectedItems.includes('sapulidi')) baseRate -= 5; // Terrible weapon

    // Strategy modifier
    const strategy = ZOMBIE_STRATEGIES.find(s => s.id === selectedStrategy);
    let strategyModifier = 0;
    let strategyText = "";

    if (selectedStrategy === 'genteng') {
      strategyModifier = 5;
      strategyText = "Markas genteng aman dari gigitan zombie, tapi tim Anda kelaparan setengah mati.";
    } else if (selectedStrategy === 'minimarket') {
      strategyModifier = 15;
      strategyText = "Kunci minimarket berhasil mengamankan stok makanan melimpah, tapi Anda diserang geng begal.";
    } else if (selectedStrategy === 'barbar') {
      strategyModifier = -25;
      strategyText = "Menyerang membabi buta sangat gagah berani namun konyol, banyak anggota terluka parah.";
    } else if (selectedStrategy === 'rakit') {
      strategyModifier = 20;
      strategyText = "Rakit kayu berhasil mencapai pulau kecil terpencil yang bebas zombie.";
    }

    const finalRate = Math.min(Math.max(Math.round(baseRate + strategyModifier), 5), 98);

    // Build narrative description
    const friendNames = friendsStats.map(f => f.name).join(', ');
    let narrative = `Bertahan hidup bersama ${friendNames}. Dengan bekal seadanya, tim memutuskan untuk ${strategy.name.toLowerCase()}. ${strategyText}`;

    if (finalRate >= 75) {
      narrative += " Hasilnya: Kalian berhasil bertahan hingga militer datang menyelamatkan! Selamat!";
    } else if (finalRate >= 50) {
      narrative += " Hasilnya: Kalian bertahan tapi compang-camping dan harus terus berpindah mencari makan.";
    } else {
      narrative += " Hasilnya: Tragis! Salah satu anggota tim berubah menjadi zombie diam-diam dan menggigit yang lain saat tidur.";
    }

    setSimulationResult({
      pct: finalRate,
      label: finalRate >= 75 ? "SURVIVED! 🎉" : finalRate >= 50 ? "STRUGGLING 🪓" : "ZOMBIFIED 🧟",
      desc: narrative
    });
  };

  const handleFriendSelect = (id) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleItemSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="glass-panel p-8 max-w-3xl mx-auto text-left flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-zinc-950">
        <div>
          <span className="badge-secondary mb-1">NUSA-BENCH Fun Modes</span>
          <h2 className="text-xl font-bold text-zinc-950">Game Hiburan Otak</h2>
        </div>
        <button onClick={handleBackClick} className="btn btn-secondary !py-1.5 !px-3 !min-h-[36px] text-xs">
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Mode Selection Grid */}
      {!activeMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="badge mb-2">KUIS KEPRIBADIAN</span>
              <h3 className="text-base font-bold text-zinc-950 mb-1">Apakah Kamu NPC? 🤖</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">Cari tahu apakah respon hidup Anda default (template kota) atau orisinal.</p>
            </div>
            <button onClick={() => { setActiveMode('npc'); setQuizIdx(0); setRunningScore(0); }} className="btn btn-primary w-full mt-4">
              Mulai Tes NPC
            </button>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="badge-secondary mb-2">LOKAL KEARIFAN</span>
              <h3 className="text-base font-bold text-zinc-950 mb-1">Seberapa Indo Kamu? 🇮🇩</h3>
              <p className="text-xs text-zinc-655 leading-relaxed">Uji seberapa melekat kebiasaan, taktik hidup, dan budaya Nusantara pada diri Anda.</p>
            </div>
            <button onClick={() => { setActiveMode('indo'); setQuizIdx(0); setRunningScore(0); }} className="btn btn-primary w-full mt-4">
              Mulai Tes
            </button>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="badge mb-2">SIMULASI STRATEGIS</span>
              <h3 className="text-base font-bold text-zinc-950 mb-1">Zombie Apocalypse 🧟</h3>
              <p className="text-xs text-zinc-650 leading-relaxed">Rancang tim, pilih perbekalan lokal, dan tentukan strategi bertahan hidup dari wabah zombie.</p>
            </div>
            <button onClick={() => { setActiveMode('zombie'); }} className="btn btn-primary w-full mt-4">
              Buka Simulator
            </button>
          </div>

        </div>
      )}

      {/* --- 1. NPC Quiz Render --- */}
      {activeMode === 'npc' && simulationResult === null && quizIdx < NPC_QUESTIONS.length && (
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-zinc-550">Pertanyaan {quizIdx + 1} dari {NPC_QUESTIONS.length}</span>
          <h3 className="text-lg font-bold text-zinc-950 leading-relaxed">
            {NPC_QUESTIONS[quizIdx].q}
          </h3>
          <div className="flex flex-col gap-3">
            {NPC_QUESTIONS[quizIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleNpcAnswer(opt.npc)}
                className="btn btn-secondary w-full justify-start text-left p-4 !min-h-[50px]"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- 2. Seberapa Indonesia Quiz Render --- */}
      {activeMode === 'indo' && simulationResult === null && quizIdx < INDO_HABIT_QUESTIONS.length && (
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold text-zinc-550">Pertanyaan {quizIdx + 1} dari {INDO_HABIT_QUESTIONS.length}</span>
          <h3 className="text-lg font-bold text-zinc-950 leading-relaxed">
            {INDO_HABIT_QUESTIONS[quizIdx].q}
          </h3>
          <div className="flex flex-col gap-3">
            {INDO_HABIT_QUESTIONS[quizIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleIndoAnswer(opt.score)}
                className="btn btn-secondary w-full justify-start text-left p-4 !min-h-[50px]"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- 3. Zombie Apocalypse Simulator Render --- */}
      {activeMode === 'zombie' && simulationResult === null && (
        <div className="flex flex-col gap-6">
          
          {/* Step 1: Friends */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span>1. Pilih 3 Orang Anggota Tim ({selectedFriends.length}/3)</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ZOMBIE_FRIENDS.map(f => {
                const isSelected = selectedFriends.includes(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => handleFriendSelect(f.id)}
                    className={`
                      p-3 rounded-lg border-2 border-zinc-950 transition-all duration-150 cursor-pointer select-none
                      ${isSelected 
                        ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5' 
                        : 'bg-white text-zinc-950 hover:bg-zinc-50'
                      }
                    `}
                  >
                    <strong className={`block text-xs ${isSelected ? 'text-white' : 'text-zinc-950'}`}>{f.name}</strong>
                    <span className={`text-[10px] block mt-1 ${isSelected ? 'text-white/90' : 'text-zinc-500'}`}>
                      Pukul: {f.combat} | Tahan: {f.survival}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Items */}
          <div className="flex flex-col gap-3 border-t-2 border-zinc-950 pt-5">
            <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Shield size={16} className="text-orange-600" />
              <span>2. Pilih 3 Barang Perbekalan ({selectedItems.length}/3)</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ZOMBIE_ITEMS.map(i => {
                const isSelected = selectedItems.includes(i.id);
                return (
                  <div
                    key={i.id}
                    onClick={() => handleItemSelect(i.id)}
                    className={`
                      p-3 rounded-lg border-2 border-zinc-950 transition-all duration-150 cursor-pointer select-none
                      ${isSelected 
                        ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5' 
                        : 'bg-white text-zinc-950 hover:bg-zinc-50'
                      }
                    `}
                  >
                    <strong className={`block text-xs ${isSelected ? 'text-white' : 'text-zinc-950'}`}>{i.name}</strong>
                    <p className={`text-[10px] mt-1 leading-tight ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>{i.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Strategy */}
          <div className="flex flex-col gap-3 border-t-2 border-zinc-950 pt-5">
            <h4 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Zap size={16} className="text-amber-500 fill-amber-500" />
              <span>3. Pilih 1 Strategi Utama</span>
            </h4>
            <div className="flex flex-col gap-2">
              {ZOMBIE_STRATEGIES.map(s => {
                const isSelected = selectedStrategy === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStrategy(s.id)}
                    className={`
                      p-4 rounded-xl border-2 border-zinc-950 transition-all duration-150 cursor-pointer select-none flex justify-between items-center
                      ${isSelected 
                        ? 'bg-orange-500 text-white shadow-[3px_3px_0px_0px_#000] -translate-x-1 -translate-y-1' 
                        : 'bg-white text-zinc-950 hover:bg-zinc-50'
                      }
                    `}
                  >
                    <div>
                      <strong className={`block text-sm ${isSelected ? 'text-white' : 'text-zinc-950'}`}>{s.name}</strong>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/85' : 'text-zinc-500'}`}>{s.desc}</p>
                    </div>
                    <div className={`
                      w-4 h-4 rounded-full border-2 border-zinc-950 transition-all duration-150
                      ${isSelected ? 'bg-white' : 'bg-zinc-100'}
                    `} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trigger Simulation */}
          <button
            onClick={runZombieSimulation}
            className="btn btn-primary w-full mt-4"
          >
            Mulai Simulasi Kiamat
          </button>
        </div>
      )}

      {/* --- Simulation & Quiz Results Container --- */}
      {simulationResult !== null && (
        <div className="flex flex-col items-center text-center py-4 gap-6 w-full">
          
          <div>
            <span className="badge mb-2">HASIL ANALISIS</span>
            <h3 className="text-2xl font-extrabold text-zinc-950">
              {simulationResult.label}
            </h3>
          </div>

          <div>
            <span className="text-xs font-bold text-zinc-550 uppercase tracking-widest block mb-1">
              {activeMode === 'npc' ? 'NPC SCORE' : activeMode === 'indo' ? 'INDONESIAN SCORE' : 'SURVIVAL PROBABILITY'}
            </span>
            <span className="text-6xl font-black text-orange-600">
              {simulationResult.pct}%
            </span>
          </div>

          <div className="glass-panel p-6 bg-zinc-50 border-l-8 border-l-orange-600 border-zinc-950 w-full text-left">
            <p className="text-zinc-950 text-sm font-semibold leading-relaxed">
              {simulationResult.desc}
            </p>
          </div>

          <button onClick={resetAll} className="btn btn-primary w-full max-w-xs gap-2">
            <RefreshCw size={15} />
            <span>Kembali ke Pilihan Game</span>
          </button>

        </div>
      )}

    </div>
  );
}
