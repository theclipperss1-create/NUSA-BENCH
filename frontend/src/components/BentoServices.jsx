import { Code2, Smartphone, Cloud, BrainCircuit, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function BentoServices({ setCurrentView }) {
  const services = [
    {
      id: 'web',
      icon: <Code2 size={32} className="svc-icon text-zinc-950" />,
      title: 'Fullstack Web App Development',
      badge: 'POPULER',
      desc: 'Pengembangan web app kustom yang cepat, aman, dan dirancang dengan estetika premium. Dari landing page interaktif hingga aplikasi SaaS berskala besar.',
      features: ['Vite + React / Next.js', 'Desain Sistem Kustom', 'API Terintegrasi'],
      gridClass: 'col-span-2',
      color: 'hsl(45, 95%, 50%)' // Yellow accent
    },
    {
      id: 'mobile',
      icon: <Smartphone size={32} className="svc-icon text-zinc-950" />,
      title: 'Mobile App Development',
      badge: 'TERBARU',
      desc: 'Aplikasi Android & iOS native/cross-platform dengan kinerja lancar dan target interaksi sentuh presisi.',
      features: ['React Native / Flutter', 'Integrasi Cloud', 'Offline-First Storage'],
      gridClass: 'col-span-1',
      color: 'hsl(190, 95%, 45%)' // Teal accent
    },
    {
      id: 'cloud',
      icon: <Cloud size={32} className="svc-icon text-zinc-950" />,
      title: 'Cloud & DevOps Solutions',
      badge: 'OPTIMIZED',
      desc: 'Infrastruktur cloud berkinerja tinggi, deployment otomatis, dan arsitektur database modern untuk skalabilitas tanpa kendala.',
      features: ['Supabase & Neon DB', 'Vercel Deployment', 'CI/CD Pipelines'],
      gridClass: 'col-span-1',
      color: 'hsl(25, 85%, 50%)' // Orange accent
    },
    {
      id: 'ai',
      icon: <BrainCircuit size={32} className="svc-icon text-zinc-950" />,
      title: 'AI & Automation Integrations',
      badge: 'INNOVATIVE',
      desc: 'Gunakan kekuatan kecerdasan buatan dan integrasikan asisten cerdas, pemrosesan data otomatis, dan Google Workspace API.',
      features: ['Gemini AI API', 'Google Workspace CLI', 'Otomasi Workflow'],
      gridClass: 'col-span-2',
      color: 'hsl(210, 85%, 50%)' // Blue accent
    },
    {
      id: 'security',
      icon: <ShieldAlert size={32} className="svc-icon text-zinc-950" />,
      title: 'Enterprise Cyber Security',
      badge: 'CRITICAL',
      desc: 'Audit keamanan sistem secara menyeluruh, enkripsi data sensitif, dan implementasi sanitasi input terbaik untuk menangkal eksploitasi.',
      features: ['Sanitasi Model Armor', 'Enkripsi Data Lokal', 'Uji Coba Penetrasi'],
      gridClass: 'col-span-3',
      color: 'hsl(346, 80%, 50%)' // Red accent
    }
  ];

  return (
    <section className="pb-16 text-zinc-900">
      {/* Hero Header */}
      <div className="text-center mb-14 mt-6">
        <span className="badge badge-secondary mb-3">Solusi IT Agensi Premium</span>
        <h1 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-none mb-4 max-w-3xl mx-auto">
          Transformasikan Ide Digital Anda Menjadi Kenyataan
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-500 font-semibold text-sm leading-relaxed mb-8">
          NUSA-BENCH menghadirkan keahlian rekayasa perangkat lunak premium dengan performa maksimal, ringan, dan arsitektur modern bebas "AI slop".
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setCurrentView('estimator')} 
            className="btn btn-primary px-8"
          >
            <span>Mulai Estimasi Proyek</span>
            <ArrowUpRight size={18} />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('bento-grid-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="btn btn-secondary px-8"
          >
            Lihat Layanan Kami
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div id="bento-grid-anchor" className="scroll-margin-top-[100px] text-left">
        <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">Layanan Terintegrasi</h2>
        <p className="text-sm text-zinc-500 font-semibold mb-8 max-w-md">
          Pilih salah satu spesialisasi kami untuk diintegrasikan ke dalam kalkulator kalkulasi biaya Anda.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div 
              key={svc.id} 
              className="glass-panel p-8 text-left flex flex-col justify-between min-h-[280px] bg-white relative overflow-hidden"
              style={{
                gridColumn: svc.gridClass.includes('span-2') ? 'span 2' : svc.gridClass.includes('span-3') ? 'span 3' : 'span 1'
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div 
                    className="p-2.5 rounded-lg border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] inline-flex"
                    style={{ backgroundColor: svc.color }}
                  >
                    {svc.icon}
                  </div>
                  <span className={`badge ${svc.id === 'web' || svc.id === 'ai' ? 'bg-orange-500 text-white' : 'badge-secondary'}`}>
                    {svc.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black text-zinc-950 mb-2 uppercase tracking-tight">{svc.title}</h3>
                <p className="text-zinc-655 text-sm leading-relaxed mb-6 font-medium">{svc.desc}</p>
              </div>

              <div className="flex justify-between items-end flex-wrap gap-4 border-t-2 border-zinc-950 pt-5">
                <div className="flex gap-2 flex-wrap">
                  {svc.features.map((feat, idx) => (
                    <span key={idx} className="badge bg-zinc-50 border-2 border-zinc-950 text-[9px] font-black py-0.5 px-2">
                      {feat}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => setCurrentView('estimator')}
                  className="hover-link flex items-center gap-1 text-xs font-black uppercase text-teal-600 hover:text-orange-600 transition-all outline-none border-none bg-transparent cursor-pointer"
                >
                  <span>Estimasi</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS injection for grid overrides on smaller layouts */}
      <style>{`
        @media (max-width: 1024px) {
          #bento-grid-anchor > div {
            grid-template-cols: 1fr !important;
          }
          #bento-grid-anchor > div > div {
            grid-column: span 1 !important;
          }
        }
        .svc-icon {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-panel:hover .svc-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .hover-link {
          transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-link:hover {
          transform: translate(2px, -2px);
        }
      `}</style>
    </section>
  );
}
