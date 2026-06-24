import { useState } from 'react';
import { ShieldCheck, Info, Sparkles, Calendar, ArrowRight } from 'lucide-react';

const PLATFORMS = [
  { id: 'web', name: 'Web App Only', baseCost: 25000000, baseDays: 15 },
  { id: 'mobile', name: 'Mobile App Only', baseCost: 35000000, baseDays: 20 },
  { id: 'admin', name: 'Admin Dashboard Panel', baseCost: 20000000, baseDays: 12 },
  { id: 'web-mobile', name: 'Web & Mobile Apps', baseCost: 55000000, baseDays: 30 },
  { id: 'all', name: 'Full Ecosystem (Web, Mobile & Admin)', baseCost: 75000000, baseDays: 45 },
];

const COMPLEXITIES = [
  { id: 'minimalist', name: 'Minimalis & Clean', multiplier: 1.0, addDays: 0, desc: 'Fokus pada kecepatan pemuatan maksimal dan fungsionalitas murni.' },
  { id: 'premium', name: 'Premium (Glow & Glassmorphism)', multiplier: 1.3, addDays: 5, desc: 'Desain visual yang memukau, mikro-animasi spring-physics, dan dark mode HSL.' },
  { id: 'custom-3d', name: 'Custom Advanced (3D / Interactive)', multiplier: 1.7, addDays: 12, desc: 'Interaktivitas tingkat lanjut, visualisasi data real-time, dan elemen canvas 3D.' },
];

const FEATURES = [
  { id: 'auth', name: 'Autentikasi & Multi-role', cost: 5000000, days: 3 },
  { id: 'payment', name: 'Payment Gateway (Midtrans/Xendit)', cost: 8000000, days: 4 },
  { id: 'analytics', name: 'Analytics & Reporting Dashboard', cost: 10000000, days: 5 },
  { id: 'notifications', name: 'Sistem Notifikasi (Realtime / Push)', cost: 4000000, days: 2 },
  { id: 'ai', name: 'AI Assistant & Automation (Gemini)', cost: 12000000, days: 6 },
  { id: 'gws', name: 'Google Workspace Integration', cost: 7000000, days: 3 },
  { id: 'security-audit', name: 'Keamanan Tingkat Tinggi (Model Armor & Audit)', cost: 9000000, days: 4 },
];

export default function Estimator({ setBookingDetails, setCurrentView }) {
  const [platform, setPlatform] = useState('web');
  const [complexity, setComplexity] = useState('premium');
  const [selectedFeatures, setSelectedFeatures] = useState(['auth']);
  const [projectTitle, setProjectTitle] = useState('');
  
  const selectedPlatform = PLATFORMS.find(p => p.id === platform);
  const selectedComplexity = COMPLEXITIES.find(c => c.id === complexity);
  
  let baseCost = selectedPlatform.baseCost;
  let baseDays = selectedPlatform.baseDays;

  let featuresCost = 0;
  let featuresDays = 0;

  selectedFeatures.forEach(featId => {
    const feat = FEATURES.find(f => f.id === featId);
    if (feat) {
      featuresCost += feat.cost;
      featuresDays += feat.days;
    }
  });

  const totalCost = Math.round((baseCost * selectedComplexity.multiplier) + featuresCost);
  const totalDays = Math.round((baseDays + selectedComplexity.addDays) + featuresDays);

  const handleFeatureToggle = (id) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleProceedToBooking = () => {
    const selectedPlatform = PLATFORMS.find(p => p.id === platform);
    const selectedComplexity = COMPLEXITIES.find(c => c.id === complexity);
    
    setBookingDetails({
      title: projectTitle || `Proyek ${selectedPlatform.name}`,
      platform: selectedPlatform.name,
      complexity: selectedComplexity.name,
      features: selectedFeatures.map(fId => FEATURES.find(f => f.id === fId)?.name || ''),
      estimatedCost: totalCost,
      estimatedDuration: totalDays
    });
    setCurrentView('booking');
  };

  return (
    <section className="pb-16 text-zinc-900">
      <div className="text-center mb-10 text-left">
        <span className="badge badge-secondary mb-2">Interactive Tool</span>
        <h1 className="text-3xl font-black text-zinc-955 tracking-tight uppercase mb-2">Kalkulator Estimasi Proyek</h1>
        <p className="max-w-xl text-zinc-500 font-semibold text-sm mt-1">
          Sesuaikan platform, kerumitan UI, dan fitur yang dibutuhkan untuk melihat estimasi anggaran dan durasi pengerjaan secara instan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Estimator Configuration Panel */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 bg-white text-left flex flex-col gap-6">
          
          {/* Project Title Input */}
          <div className="form-group !mb-0">
            <label className="form-label">Nama / Judul Proyek Anda</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: Aplikasi Booking Klinik Nusa"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
          </div>

          {/* Platform selection */}
          <div>
            <label className="form-label block mb-3">Pilih Platform Proyek</label>
            <div className="flex flex-col gap-3">
              {PLATFORMS.map(p => {
                const isSelected = platform === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all duration-150 ${
                      isSelected 
                        ? 'border-zinc-950 bg-amber-100 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] -translate-y-0.5' 
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <div>
                      <strong className="block text-zinc-950 font-black text-sm uppercase">{p.name}</strong>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wide">
                        Mulai dari {formatIDR(p.baseCost)} • Estimasi ±{p.baseDays} hari
                      </span>
                    </div>
                    <div className={`w-[18px] h-[18px] rounded-full border-2 transition-all ${
                      isSelected 
                        ? 'border-zinc-955 bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.4)]' 
                        : 'border-zinc-300 bg-white'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complexity selection */}
          <div>
            <label className="form-label block mb-3">Pilih Kompleksitas Desain & UI/UX</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {COMPLEXITIES.map(c => {
                const isSelected = complexity === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setComplexity(c.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between min-h-[140px] transition-all duration-150 ${
                      isSelected 
                        ? 'border-zinc-950 bg-orange-100 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] -translate-y-0.5' 
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <div>
                      <strong className="block mb-1.5 text-zinc-950 font-black text-xs uppercase">{c.name}</strong>
                      <span className="text-[11px] text-zinc-550 leading-relaxed block font-semibold">{c.desc}</span>
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-wider mt-4 ${
                      isSelected ? 'text-orange-600' : 'text-zinc-400'
                    }`}>
                      Multiplier: x{c.multiplier}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features selection */}
          <div>
            <label className="form-label block mb-3">Pilih Fitur & Integrasi Tambahan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FEATURES.map(f => {
                const isSelected = selectedFeatures.includes(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => handleFeatureToggle(f.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all duration-150 ${
                      isSelected 
                        ? 'border-zinc-950 bg-teal-50 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)] -translate-y-0.5' 
                        : 'border-zinc-200 bg-white hover:border-zinc-400'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      readOnly
                      className="accent-zinc-950 cursor-pointer w-4 h-4"
                    />
                    <div className="text-left">
                      <strong className="block text-xs font-black text-zinc-950 uppercase">{f.name}</strong>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        +{formatIDR(f.cost)} (+{f.days} hari)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Calculation Result Panel */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-[100px]">
          
          <div className="glass-panel p-6 md:p-8 bg-white text-left border-l-[6px] border-l-teal-500">
            <h3 className="text-lg font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 pb-2.5 border-b-2 border-zinc-950 mb-6">
              <Sparkles size={18} className="text-orange-500" />
              <span>Ringkasan Estimasi</span>
            </h3>

            {/* Cost Display */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">PERKIRAAN BIAYA</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl md:text-3xl font-black text-teal-600">
                  {formatIDR(totalCost)}
                </span>
              </div>
            </div>

            {/* Duration Display */}
            <div className="mb-8 border-t-2 border-zinc-950 pt-5">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-2">ESTIMASI DURASI</span>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" />
                <span className="text-lg font-black text-zinc-950 uppercase">
                  {totalDays} Hari Kerja
                </span>
              </div>
            </div>

            {/* Quality badge list */}
            <div className="flex flex-col gap-3 mb-8 text-xs font-bold text-zinc-650">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Optimasi & Penetrasi Keamanan Terintegrasi</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Tanpa Boilerplate / AI Slop (Custom CSS)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Dukungan Teknis & QA Penuh</span>
              </div>
            </div>

            {/* Proceed CTA */}
            <button 
              onClick={handleProceedToBooking}
              className="btn btn-primary w-full gap-2 !py-3 !min-h-[46px] text-xs font-black"
            >
              <span>Lanjutkan Pemesanan</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="glass-panel p-5 flex gap-3.5 items-start bg-zinc-50 border-2 border-zinc-950 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
            <Info size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-left text-xs">
              <strong className="text-zinc-950 block font-black uppercase tracking-wider mb-1">Skema DP 50%</strong>
              <p className="text-zinc-500 font-bold leading-relaxed">Pengerjaan proyek resmi dimulai setelah Down Payment disetujui. Sisa 50% dilunasi pada saat UAT serah terima proyek.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
