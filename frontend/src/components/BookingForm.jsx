import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { gooeyToast } from 'goey-toast';
import Input from './ui/Input';
import Button from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

export default function BookingForm({ bookingDetails, setCurrentView }) {
  const { login } = useAuth();
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectTitle, setProjectTitle] = useState(bookingDetails?.title || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientName.trim() || !email.trim() || !projectTitle.trim()) {
      gooeyToast.error("Mohon isi semua field wajib (Nama, Email, dan Judul Proyek).");
      return;
    }

    if (!email.includes('@')) {
      gooeyToast.error("Format email tidak valid.");
      return;
    }

    setIsSubmitting(true);
    
    // Wrap entire multi-step process in a gooey toast promise
    const bookingPromise = (async () => {
      // 1. Authenticate / Login user
      await login(email);

      // 2. Save user profile details
      await api.updateProfile({
        clientName: clientName.trim(),
        company: company.trim() || '',
        phone: '',
        address: '',
        techStackPreference: bookingDetails?.features?.join(', ') || 'React & Node.js'
      });

      // 3. Register the new project
      const payload = {
        title: projectTitle,
        platform: bookingDetails?.platform || 'Web App Only',
        complexity: bookingDetails?.complexity || 'Premium',
        features: bookingDetails?.features || [],
        estimatedCost: bookingDetails?.estimatedCost || 25000000,
        estimatedDuration: bookingDetails?.estimatedDuration || 15
      };

      const project = await api.createProject(payload);
      return project;
    })();

    gooeyToast.promise(bookingPromise, {
      loading: 'Mengamankan sesi dan meregistrasikan proyek...',
      success: 'Registrasi sukses! Selamat datang di NUSA-BENCH Workspace.',
      error: (err) => err.message || 'Gagal finalisasi pesanan proyek.'
    });

    try {
      const result = await bookingPromise;
      if (result) {
        // Reset form
        setClientName('');
        setEmail('');
        setCompany('');
        
        // Redirect to dashboard
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Finalisasi booking gagal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto my-6 animate-fade-in px-4">
      <Button
        variant="secondary"
        onClick={() => setCurrentView('estimator')}
        disabled={isSubmitting}
        className="!min-h-0 !h-10 !py-2 !px-4 text-xs gap-1.5 mb-6"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Kalkulator</span>
      </Button>

      <Card hoverEffect={false}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={24} className="text-orange-500" />
            <span>Finalisasi Pesanan Proyek</span>
          </CardTitle>
          <CardDescription>
            Isi detail kontak Anda di bawah ini untuk mengirimkan spesifikasi teknis dan membuat sesi dashboard klien.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          {/* Project Spec Summary */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-5 rounded-xl border-2 border-zinc-950 mb-8 text-left shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Platform</span>
              <strong className="text-sm text-zinc-950 font-black">{bookingDetails?.platform || 'Web App Only'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Kompleksitas UI</span>
              <strong className="text-sm text-zinc-950 font-black">{bookingDetails?.complexity || 'Premium (Glassmorphism)'}</strong>
            </div>
            <div className="col-span-2 border-t-2 border-zinc-950 pt-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Fitur Pilihan</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {bookingDetails?.features && bookingDetails.features.map((f, i) => (
                  <span key={i} className="badge bg-orange-500 text-white shadow-none text-[9px] font-black border-zinc-950 px-2 py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-span-2 border-t-2 border-zinc-950 pt-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Estimasi Durasi</span>
                <strong className="text-base text-zinc-950 font-black font-heading uppercase">{bookingDetails?.estimatedDuration || 15} Hari Kerja</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block">Estimasi Biaya</span>
                <strong className="text-base text-teal-600 font-black font-heading">{formatIDR(bookingDetails?.estimatedCost || 25000000)}</strong>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Kontak Utama"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nama Lengkap Anda"
                required
                disabled={isSubmitting}
              />
              <Input
                label="Email Perusahaan / Kontak"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@perusahaan.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <Input
              label="Nama Instansi / Perusahaan (Optional)"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="PT Contoh Digital"
              disabled={isSubmitting}
            />

            <Input
              label="Judul Proyek"
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Contoh: Aplikasi E-Commerce PT ABC"
              required
              disabled={isSubmitting}
            />

            <div className="pt-4 border-t-2 border-zinc-950 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="w-full sm:w-auto"
              >
                <Send size={16} />
                <span>Kirim Pemesanan Proyek</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
