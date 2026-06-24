import { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

export default function LoginPortal({ setCurrentView }) {
  const { login, loading } = useProject();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      gooeyToast.error("Masukkan alamat email Anda.");
      return;
    }
    try {
      await login(email);
      setCurrentView('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="max-w-[420px] mx-auto my-12 px-4 text-zinc-900">
      
      <div className="glass-panel p-8 bg-white flex flex-col gap-6 relative overflow-hidden">
        
        <div className="w-16 h-16 rounded-xl bg-amber-400 border-2 border-zinc-950 text-zinc-950 flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
          <ShieldCheck size={32} />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight uppercase">Portal Klien NUSA-BENCH</h2>
          <p className="text-xs text-zinc-550 mt-1.5 leading-relaxed max-w-xs mx-auto font-semibold">
            Masuk menggunakan email terdaftar untuk melacak progres proyek dan riwayat invoice.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          
          <div className="form-group !mb-0">
            <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Email Kontak Klien</label>
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail size={15} />
              </span>
              <input 
                type="email" 
                className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300" 
                placeholder="client@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full gap-2 !py-2.5 !min-h-[42px] text-xs font-bold mt-2"
            disabled={loading}
          >
            <span>Masuk ke Workspace</span>
            <ArrowRight size={13} />
          </button>

        </form>

        <div className="mt-2 border-t-2 border-zinc-950 pt-5 text-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          Belum memiliki proyek?{' '}
          <button 
            onClick={() => setCurrentView('estimator')}
            className="text-teal-600 hover:text-orange-600 font-black cursor-pointer bg-transparent border-none outline-none hover:underline"
          >
            Kalkulator Estimasi
          </button>
        </div>

      </div>

    </section>
  );
}
