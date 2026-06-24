import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { gooeyToast } from 'goey-toast';
import { User, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingProfileModal() {
  const { client, updateProfile, setIsProfileIncomplete } = useAuth();
  
  // Pre-populate username if possible (e.g. from email prefix)
  const [username, setUsername] = useState(client?.username?.startsWith('user_') ? '' : (client?.username || ''));
  const [fullName, setFullName] = useState(client?.full_name || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validasi Username
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      setError('Username harus berkisar antara 3 - 30 karakter.');
      return;
    }

    setSubmitting(false);
    const savePromise = (async () => {
      setSubmitting(true);
      await updateProfile({
        username: cleanUsername,
        full_name: fullName.trim() || client?.full_name || ''
      });
      setIsProfileIncomplete(false);
    })();

    gooeyToast.promise(savePromise, {
      loading: 'Menyimpan data profil...',
      success: 'Profil Anda telah lengkap! Selamat bermain! 🚀',
      error: (err) => err.response?.data?.error || err.message || 'Gagal menyimpan profil.'
    });

    try {
      await savePromise;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Gagal menyimpan data.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm select-none">
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="w-full max-w-[460px] border-[3px] border-zinc-950 p-8 bg-white shadow-[8px_8px_0px_0px_rgba(12,10,9,1)] rounded-xl text-left"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-400 border-2 border-zinc-950 rounded-lg shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] text-zinc-950">
            <CheckCircle size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-950 uppercase tracking-tight leading-tight">Lengkapi Profil</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Langkah Terakhir Sesi Google OAuth</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-orange-50 border-2 border-zinc-950 rounded-xl text-xs text-orange-850 font-medium leading-relaxed">
          <p>
            Selamat datang! Akun Google Anda berhasil terhubung. Sekarang silakan tentukan <strong>Username</strong> unik Anda untuk berpartisipasi dalam papan peringkat kognitif nasional.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-650 font-bold flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="form-group !mb-0">
            <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Username Unik *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User size={15} />
              </span>
              <input
                type="text"
                required
                disabled={submitting}
                placeholder="Contoh: kancil_cerdik"
                className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              />
            </div>
            <span className="text-[9px] text-zinc-400 font-medium mt-1 pl-1">
              * Hanya huruf kecil, angka, dan underscore (_). Minimal 3 karakter.
            </span>
          </div>

          <div className="form-group !mb-0">
            <label className="form-label !text-[11px] !font-bold uppercase tracking-wider text-zinc-400">Nama Lengkap (Opsional)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User size={15} />
              </span>
              <input
                type="text"
                disabled={submitting}
                placeholder="Contoh: Kancil Nusantara"
                className="form-input !pl-10 !py-2.5 !text-xs !bg-zinc-50 focus:!bg-white hover:border-zinc-300"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full justify-center gap-2 !py-2.5 !min-h-[42px] text-xs font-bold mt-4"
          >
            <span>Simpan Profil & Mulai Bermain</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
