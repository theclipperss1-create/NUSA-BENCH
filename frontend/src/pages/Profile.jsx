import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiInstance } from '../services/api';
import { gooeyToast } from 'goey-toast';

export default function Profile() {
  const { client, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState('');

  // Sync state with client data on load
  useEffect(() => {
    if (client) {
      setFullName(client.full_name || '');
      setUsername(client.username || '');
      setWebsite(client.website || '');
      setAvatarInput(client.avatar || '🧠');
    }
  }, [client]);

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4 bg-white text-zinc-900">
        <div className="border border-zinc-200 rounded-xl p-8 text-center bg-zinc-50">
          <h3 className="text-lg font-semibold text-zinc-800">Silakan login terlebih dahulu untuk mengakses profil Anda.</h3>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      gooeyToast.error("Username tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        full_name: fullName,
        username: username,
        website: website
      });
      gooeyToast.success("Profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      gooeyToast.error(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e) => {
    e.preventDefault();
    if (!avatarInput.trim()) return;

    try {
      await apiInstance.put('/profiles/me', {
        avatar_url: avatarInput.trim()
      });
      // Trigger a sync
      window.location.reload();
    } catch (err) {
      console.error(err);
      gooeyToast.error("Gagal mengganti avatar.");
    } finally {
      setIsEditingAvatar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 bg-transparent text-zinc-900">
      
      {/* Page Header */}
      <div className="mb-8 text-left">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Pengaturan Profil</span>
        <h2 className="text-2xl font-black text-zinc-950 mt-1">Kelola Akun Anda</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Perbarui informasi profil dan lihat tingkat kognitif Anda.
        </p>
      </div>

      {/* Grid / Bento Box layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Card */}
        <div className="glass-panel p-6 bg-white text-center flex flex-col items-center justify-between min-h-[260px] shadow-sm">
          <div className="w-full flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-center text-4xl mb-4 overflow-hidden select-none shadow-inner-sm">
              {client.avatar}
            </div>
            
            <h3 className="font-bold text-zinc-950 text-lg">{client.username}</h3>
            <span className="badge mt-2">
              Lvl {client.level} — {client.levelName}
            </span>
          </div>

          <div className="w-full mt-6 pt-4 border-t border-zinc-100">
            {!isEditingAvatar ? (
              <button 
                type="button" 
                onClick={() => setIsEditingAvatar(true)}
                className="text-xs font-bold text-zinc-500 hover:text-orange-600 cursor-pointer border-none bg-transparent outline-none uppercase tracking-wider"
              >
                Ganti Foto / Emoji
              </button>
            ) : (
              <form onSubmit={handleAvatarChange} className="w-full flex gap-2">
                <input 
                  type="text" 
                  value={avatarInput} 
                  onChange={(e) => setAvatarInput(e.target.value)}
                  placeholder="Emoji / URL Gambar"
                  className="form-input !px-2.5 !py-1.5 text-xs"
                  maxLength={100}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary !py-1.5 !px-3 !min-h-[32px] text-xs font-bold"
                >
                  Simpan
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Form Detail */}
        <div className="md:col-span-2 glass-panel p-8 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="full_name" className="text-xs uppercase text-zinc-400 font-bold text-left tracking-wider">
                Nama Lengkap
              </label>
              <input
                id="full_name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Gunawan"
                className="form-input"
              />
            </div>

            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-xs uppercase text-zinc-400 font-bold text-left tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: budi_gunawan"
                className="form-input"
                maxLength={15}
                required
              />
            </div>

            {/* Website Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="website" className="text-xs uppercase text-zinc-400 font-bold text-left tracking-wider">
                Website
              </label>
              <input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Contoh: budi.com"
                className="form-input"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary min-h-[44px]"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
