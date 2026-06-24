import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Zap, Target, Brain, Grid, Eye, BookOpen, Flag } from 'lucide-react';
import { gooeyToast } from 'goey-toast';

const LEADERBOARD_TABS = [
  { id: 'reaction', name: 'Reaction', icon: <Zap size={14} /> },
  { id: 'aimTrainer', name: 'Aim', icon: <Target size={14} /> },
  { id: 'numberMemory', name: 'Numbers', icon: <Brain size={14} /> },
  { id: 'sequenceMemory', name: 'Sequence', icon: <Grid size={14} /> },
  { id: 'visualMemory', name: 'Visual', icon: <Eye size={14} /> },
  { id: 'verbalMemory', name: 'Verbal', icon: <BookOpen size={14} /> },
  { id: 'wawasanIndonesia', name: 'Wawasan', icon: <Flag size={14} /> },
];

export default function Leaderboard({ onViewProfile }) {
  const { client, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('reaction');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaderboards();
      setLeaderboardData(data);
    } catch (err) {
      console.error(err);
      gooeyToast.error('Gagal mengambil data peringkat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getActiveList = () => {
    if (!leaderboardData) return [];
    return leaderboardData[activeTab] || [];
  };

  const formatScore = (score, tabId) => {
    if (tabId === 'reaction') return `${score} ms`;
    if (tabId === 'aimTrainer') return `${(score / 100).toFixed(2)} tps`;
    if (tabId === 'wawasanIndonesia') return `${score} Poin`;
    return `Level ${score}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <section className="bg-transparent text-zinc-900 py-6 text-left">
      
      {/* Header */}
      <div className="mb-8">
        <span className="badge badge-secondary mb-2">Peringkat Nasional</span>
        <h2 className="text-2xl font-black text-zinc-950">Papan Peringkat Nusantara</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Lihat pencapaian skor kognitif terbaik dari seluruh penjuru tanah air.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 border-b-2 border-zinc-950">
        {LEADERBOARD_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
            }}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-black rounded-md cursor-pointer border-2 border-zinc-950 transition-all duration-150 outline-none min-h-[38px] uppercase tracking-wider select-none ${
              activeTab === tab.id 
                ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(12,10,9,1)]' 
                : 'bg-white text-zinc-700 hover:bg-zinc-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(12,10,9,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto py-2">
        {loading ? (
          <div className="glass-panel p-10 text-center text-zinc-800 font-black">
            Mengambil data peringkat...
          </div>
        ) : getActiveList().length === 0 ? (
          <div className="glass-panel p-10 text-center text-zinc-800 font-black">
            Belum ada skor tercatat untuk kategori ini. Jadilah yang pertama!
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-4 py-3">Peringkat</th>
                <th className="px-4 py-3">Pengguna</th>
                <th className="px-4 py-3 text-right">Skor Terbaik</th>
                <th className="px-4 py-3 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {getActiveList().map((entry, idx) => {
                const isCurrentUser = isAuthenticated && client && entry.username === client.username;
                const rank = idx + 1;
                let rankDisplay = `#${rank}`;

                if (rank === 1) rankDisplay = "🥇 #1";
                else if (rank === 2) rankDisplay = "🥈 #2";
                else if (rank === 3) rankDisplay = "🥉 #3";

                return (
                  <tr 
                    key={idx} 
                    className={`hover:bg-zinc-50 transition-colors ${
                      isCurrentUser ? 'bg-orange-50 font-extrabold text-zinc-950' : 'text-zinc-800'
                    }`}
                  >
                    <td className="px-4 py-4 font-black">
                      {rankDisplay}
                    </td>
                    <td className="px-4 py-4">
                      <div 
                        onClick={() => onViewProfile(entry.username)}
                        className="flex items-center gap-2 cursor-pointer hover:text-orange-655 transition-colors"
                        title={`Lihat profil ${entry.username}`}
                      >
                        <span className="font-extrabold underline decoration-dotted underline-offset-4">{entry.username}</span>
                        {isCurrentUser && (
                          <span className="badge text-[9px] py-0.5 px-2 shadow-none border-zinc-950">
                            Kamu
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-black text-orange-600">
                      {formatScore(entry.score, activeTab)}
                    </td>
                    <td className="px-4 py-4 text-right text-zinc-500 text-xs font-semibold">
                      {formatDate(entry.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </section>
  );
}
