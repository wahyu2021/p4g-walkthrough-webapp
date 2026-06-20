import { useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Ticket as TicketIcon, Users, Megaphone, Trophy } from 'lucide-react';

import { AdminMetrics } from '../components/organisms/admin/AdminMetrics';
import { AdminTickets } from '../components/organisms/admin/AdminTickets';
import { AdminUsers } from '../components/organisms/admin/AdminUsers';
import { AdminAnnouncements } from '../components/organisms/admin/AdminAnnouncements';
import { AdminLeaderboard } from '../components/organisms/admin/AdminLeaderboard';


const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export function AdminPanel() {
  const { role, token } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();
  // Mengambil segmen terakhir dari URL /admin/xxx, default ke 'overview'
  const activeTab = location.pathname.split('/').pop() === 'admin' ? 'overview' : location.pathname.split('/').pop() || 'overview';

  useEffect(() => {
    if (role !== 'admin') navigate('/');
  }, [role, navigate]);

  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-p4-black text-white relative overflow-hidden flex flex-col md:flex-row">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-p4-yellow/10 to-transparent pointer-events-none mix-blend-overlay"></div>

      {/* Sidebar Navigasi Vertikal */}
      <div className="w-full md:w-64 bg-[#111] border-b-2 md:border-b-0 md:border-r-2 border-p4-yellow/30 z-20 flex flex-col relative md:min-h-screen shrink-0 shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-gray-800 bg-p4-yellow/5">
          <h1 className="text-2xl font-black text-p4-yellow uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
            Sistem Komando Pusat
          </p>
        </div>

        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible p-4 gap-2 flex-1 items-start md:items-stretch">
          <Link to="/admin/overview" className={`flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest transition-all text-xs text-left whitespace-nowrap md:whitespace-normal shrink-0 border-l-4 ${activeTab === 'overview' ? 'bg-p4-yellow text-p4-black border-p4-yellow shadow-[4px_4px_0_0_#000]' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-gray-600'}`}>
            <Activity className="w-4 h-4" /> Overview & Metrik
          </Link>
          <Link to="/admin/announcements" className={`flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest transition-all text-xs text-left whitespace-nowrap md:whitespace-normal shrink-0 border-l-4 ${activeTab === 'announcements' ? 'bg-p4-yellow text-p4-black border-p4-yellow shadow-[4px_4px_0_0_#000]' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-gray-600'}`}>
            <Megaphone className="w-4 h-4" /> Papan Pengumuman
          </Link>
          <Link to="/admin/leaderboard" className={`flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest transition-all text-xs text-left whitespace-nowrap md:whitespace-normal shrink-0 border-l-4 ${activeTab === 'leaderboard' ? 'bg-p4-yellow text-p4-black border-p4-yellow shadow-[4px_4px_0_0_#000]' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-gray-600'}`}>
            <Trophy className="w-4 h-4" /> Papan Peringkat
          </Link>
          <Link to="/admin/tickets" className={`flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest transition-all text-xs text-left whitespace-nowrap md:whitespace-normal shrink-0 border-l-4 ${activeTab === 'tickets' ? 'bg-p4-yellow text-p4-black border-p4-yellow shadow-[4px_4px_0_0_#000]' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-gray-600'}`}>
            <TicketIcon className="w-4 h-4" /> Sistem Tiket
          </Link>
          <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 font-black uppercase tracking-widest transition-all text-xs text-left whitespace-nowrap md:whitespace-normal shrink-0 border-l-4 ${activeTab === 'users' ? 'bg-p4-yellow text-p4-black border-p4-yellow shadow-[4px_4px_0_0_#000]' : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white hover:border-gray-600'}`}>
            <Users className="w-4 h-4" /> Manajemen Pengguna
          </Link>
        </div>

        <div className="p-4 border-t border-gray-800 mt-auto hidden md:block">
          <Link to="/" className="flex items-center gap-2 text-p4-yellow hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 z-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="md:hidden flex justify-end mb-4">
          <Link to="/" className="text-p4-yellow hover:text-white text-xs font-bold uppercase tracking-widest underline">
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'overview' && <AdminMetrics />}

          {activeTab === 'announcements' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminAnnouncements token={token || ''} baseUrl={API_BASE_URL} />
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminLeaderboard />
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminTickets />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminUsers />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
