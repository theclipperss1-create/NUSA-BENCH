import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShieldAlert, FileText, AlertCircle, CreditCard, Clock, CheckCircle2, User, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Button from './ui/Button';

export default function Dashboard({ setCurrentView }) {
  const { projects, invoices, payInvoice, loading, refreshData } = useProject();
  const { client } = useAuth();

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getInvoicesForProject = (projId) => {
    return invoices.filter(inv => inv.projectId === projId);
  };

  return (
    <section className="pb-16 px-4">
      {/* Header Info */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-10 border-b-2 border-zinc-955 pb-6 text-left">
        <div>
          <span className="badge badge-secondary mb-2">Portal Klien NUSA-BENCH</span>
          <h2 className="text-3xl font-black text-zinc-950 uppercase tracking-tight">Dashboard Pemantauan Proyek</h2>
          <p className="text-sm text-zinc-500 mt-1 font-semibold">
            Selamat datang kembali, <span className="text-orange-600 font-black">{client?.clientName || client?.username || 'Pemain'}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={refreshData}
            disabled={loading}
            className="!min-h-[40px] !py-2 !px-4 text-xs gap-1"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Sinkron</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCurrentView('profile')}
            className="!min-h-[40px] !py-2 !px-4 text-xs gap-1"
          >
            <User size={14} />
            <span>Pengaturan Profil</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setCurrentView('estimator')}
            className="!min-h-[40px] !py-2 !px-4 text-xs"
          >
            + Estimasi Proyek Baru
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="max-w-xl mx-auto" hoverEffect={false}>
          <CardContent className="p-12 text-center flex flex-col items-center">
            <AlertCircle size={48} className="text-orange-500 mb-4" />
            <CardTitle className="text-2xl mb-2">Tidak Ada Proyek Aktif</CardTitle>
            <p className="text-sm text-zinc-500 max-w-sm mb-8 leading-relaxed font-semibold">
              Anda belum mendaftarkan pesanan proyek baru. Gunakan Kalkulator Estimasi Proyek untuk mulai merancang sistem Anda.
            </p>
            <Button
              variant="primary"
              onClick={() => setCurrentView('estimator')}
            >
              Buka Kalkulator Proyek
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Projects Tracking Column */}
          <div className="lg:col-span-2 space-y-6">
            {projects.map((proj) => {
              const projInvoices = getInvoicesForProject(proj.id);
              const dpInvoice = projInvoices.find(i => i.type.includes("Down Payment"));
              const isDpPaid = dpInvoice ? dpInvoice.status === 'Paid' : true;

              return (
                <Card key={proj.id} className="relative overflow-hidden" hoverEffect={false}>
                  <CardContent className="p-8">
                    {/* Status header */}
                    <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                      <div>
                        <span className={`badge ${
                          proj.status === 'Completed' 
                            ? 'bg-emerald-400 text-zinc-950 border-2 border-zinc-950 shadow-[1.5px_1.5px_0px_0px_rgba(12,10,9,1)]' 
                            : 'bg-orange-500 text-white border-2 border-zinc-950 shadow-[1.5px_1.5px_0px_0px_rgba(12,10,9,1)]'
                        }`}>
                          {proj.status}
                        </span>
                        <h3 className="text-2xl font-black text-zinc-955 tracking-tight uppercase mt-3">{proj.title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">ESTIMASI BIAYA</span>
                        <strong className="block text-xl text-teal-600 font-heading font-black mt-1">
                          {formatIDR(proj.estimatedCost)}
                        </strong>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-zinc-500">Progres Pengembangan</span>
                        <span className="text-zinc-950">{proj.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-200 border-2 border-zinc-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full border-r-2 border-zinc-950"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Tasks timeline list */}
                    <div className="border-t-2 border-zinc-950 pt-6 mb-6">
                      <h4 className="text-base font-black uppercase tracking-wider mb-4">Tahapan Pekerjaan</h4>
                      
                      {!isDpPaid && (
                        <div className="bg-amber-100 border-2 border-zinc-950 rounded-xl p-4 mb-5 flex gap-3 items-center shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
                          <ShieldAlert size={18} className="text-orange-600 flex-shrink-0" />
                          <span className="text-xs text-zinc-950 font-bold leading-tight">
                            Pengerjaan ditangguhkan. Selesaikan pembayaran Down Payment (DP) untuk memulai fase desain.
                          </span>
                        </div>
                      )}

                      <div className="space-y-3.5">
                        {proj.tasks && proj.tasks.map((task, idx) => (
                          <div 
                            key={task.id || idx}
                            className={`flex items-center gap-3 transition-opacity duration-300 ${isDpPaid ? 'opacity-100' : 'opacity-40'}`}
                          >
                            {task.completed ? (
                              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                            ) : (
                              <Clock size={18} className="text-zinc-400 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-semibold ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Platform and details */}
                    <div className="flex justify-between items-center flex-wrap gap-3 bg-zinc-50 p-4 rounded-xl border-2 border-zinc-950 text-xs text-zinc-500 font-bold shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]">
                      <span>
                        Platform: <strong className="text-zinc-950 font-black">{proj.platform}</strong>
                      </span>
                      <span>
                        Tema UI: <strong className="text-zinc-950 font-black">{proj.complexity}</strong>
                      </span>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Invoices and Security Column */}
          <div className="space-y-6">
            
            {/* Financial Panel */}
            <Card hoverEffect={false}>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText size={18} className="text-teal-600" />
                <CardTitle className="text-lg">Riwayat Tagihan & Invoice</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {invoices.map((inv) => (
                  <div 
                    key={inv.id}
                    className="p-4 rounded-xl border-2 border-zinc-950 bg-zinc-50 flex flex-col gap-3 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="block text-sm text-zinc-955 font-black uppercase leading-tight">{inv.type}</strong>
                        <span className="text-[9px] text-zinc-400 font-bold uppercase">Invoice ID: {inv.id}</span>
                      </div>
                      <span className={`badge border-2 border-zinc-950 text-[9px] font-black py-0.5 px-2.5 shadow-[1.5px_1.5px_0px_0px_rgba(12,10,9,1)] ${
                        inv.status === 'Paid' 
                          ? 'bg-emerald-400 text-zinc-955' 
                          : 'bg-amber-400 text-zinc-955'
                      }`}>
                        {inv.status === 'Paid' ? 'LUNAS' : 'PENDING'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t-2 border-zinc-950 pt-3 mt-1">
                      <div>
                        <span className="text-[10px] text-zinc-450 block font-bold uppercase tracking-wider">Jumlah</span>
                        <strong className="text-base text-zinc-955 font-black">{formatIDR(inv.amount)}</strong>
                      </div>
                      
                      {inv.status !== 'Paid' ? (
                        <Button
                          variant="accent"
                          onClick={() => payInvoice(inv.id)}
                          disabled={loading}
                          className="!min-h-0 !h-8 !py-1 !px-3 text-xs gap-1 rounded-md"
                        >
                          <CreditCard size={12} />
                          <span>Bayar</span>
                        </Button>
                      ) : (
                        <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider">
                          Lunas {inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('id-ID') : ''}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Simulated Server Logs & Security Rules */}
            <Card hoverEffect={false}>
              <CardContent className="p-6">
                <h3 className="text-base font-black flex items-center gap-2 mb-4 text-zinc-955 uppercase tracking-tight">
                  <CheckCircle size={18} className="text-emerald-600" />
                  NUSA-BENCH Security Shield
                </h3>
                
                <div className="space-y-2.5 text-xs font-bold text-zinc-650">
                  <div className="flex justify-between border-b-2 border-zinc-950 pb-2">
                    <span className="text-zinc-500">Model Armor Templating</span>
                    <span className="text-emerald-600 font-black uppercase">Aktif</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-zinc-950 pb-2">
                    <span className="text-zinc-500">XSS Sanitizer Injection</span>
                    <span className="text-emerald-600 font-black uppercase">Aktif</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-zinc-950 pb-2">
                    <span className="text-zinc-500">Local Encrypted Sesi</span>
                    <span className="text-emerald-600 font-black uppercase">Secure</span>
                  </div>
                  
                  <div className="mt-4 font-mono text-[9px] bg-zinc-950 p-3 rounded-lg text-emerald-400 leading-relaxed border-2 border-zinc-950 shadow-[3px_3px_0px_0px_rgba(12,10,9,1)]">
                    {`> [SYSTEM LOG]: 2026-06-21T21:56\n> Connection secure.\n> Session token verified.`}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}
    </section>
  );
}
