import { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Activity, Ticket as TicketIcon, Users, Megaphone, Trophy } from 'lucide-react';

import type { Ticket, User, Metrics, LeaderboardEntry } from '../types/admin';
import { AdminMetrics } from '../components/organisms/admin/AdminMetrics';
import { AdminTickets } from '../components/organisms/admin/AdminTickets';
import { AdminUsers } from '../components/organisms/admin/AdminUsers';
import { AdminAnnouncements } from '../components/organisms/admin/AdminAnnouncements';
import { AdminLeaderboard } from '../components/organisms/admin/AdminLeaderboard';
import { useUi } from '../context/UiContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export function AdminPanel() {
  const { role, token } = useProgress();
  const navigate = useNavigate();
  const { showToast, showConfirm } = useUi();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const location = useLocation();
  // Mengambil segmen terakhir dari URL /admin/xxx, default ke 'overview'
  const activeTab = location.pathname.split('/').pop() === 'admin' ? 'overview' : location.pathname.split('/').pop() || 'overview';

  useEffect(() => {
    if (role !== 'admin') navigate('/');
  }, [role, navigate]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const mRes = await fetch(`${API_BASE_URL}/admin/metrics`, { headers });
      if (mRes.ok) setMetrics(await mRes.json());

      const tRes = await fetch(`${API_BASE_URL}/admin/invite/list`, { headers });
      if (tRes.ok) {
        const tData = await tRes.json();
        setTickets(tData.tickets || []);
      }

      const uRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users || []);
      }

      const lRes = await fetch(`${API_BASE_URL}/admin/leaderboard`, { headers });
      if (lRes.ok) {
        const lData = await lRes.json();
        setLeaderboard(lData.leaderboard || []);
      }
    } catch (err: any) { setErrorMsg('Gagal memuat data dari peladen.'); }
  };

  useEffect(() => {
    if (role === 'admin' && token) fetchData();
  }, [role, token]);

  const generateTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/generate`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Gagal mencetak tiket baru');
      await fetchData();
      showToast('Tiket berhasil dicetak!', 'success');
    } catch (err: any) { setErrorMsg(err.message); showToast(err.message, 'error'); } 
    finally { setLoading(false); }
  };

  const revokeTicket = async (ticketId: string) => {
    const isConfirmed = await showConfirm({
      title: 'Cabut Tiket',
      message: 'Hancurkan tiket ini secara permanen?',
      isDestructive: true,
      confirmText: 'Hancurkan'
    });
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/revoke`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId })
      });
      if (!res.ok) throw new Error('Gagal menghanguskan tiket');
      await fetchData(); 
      showToast('Tiket berhasil dihancurkan.', 'success');
    } catch (err: any) { setErrorMsg(err.message); showToast(err.message, 'error'); }
  };

  const purgeTickets = async () => {
    const isConfirmed = await showConfirm({
      title: 'Pembersihan Massal',
      message: 'PERINGATAN: Lenyapkan seluruh tiket usang/hangus dari database secara permanen?',
      isDestructive: true,
      confirmText: 'Lenyapkan'
    });
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/purge`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Gagal membersihkan tiket');
      await fetchData(); 
      showToast('Tiket usang berhasil dilenyapkan.', 'success');
    } catch (err: any) { setErrorMsg(err.message); showToast(err.message, 'error'); }
  };

  const toggleSuspend = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const isConfirmed = await showConfirm({
      title: 'Ubah Status',
      message: `Ubah status pengguna ini menjadi ${newStatus}?`,
      isDestructive: newStatus === 'suspended',
      confirmText: 'Ubah Status'
    });
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/suspend`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId: userId, newStatus })
      });
      if (!res.ok) throw new Error('Akses ditolak atau gagal mengubah status');
      await fetchData();
      showToast(`Status berhasil diubah menjadi ${newStatus}.`, 'success');
    } catch (err: any) { setErrorMsg(err.message); showToast(err.message, 'error'); }
  };

  const resetPassword = async (userId: string) => {
    const newPass = window.prompt('Masukkan kata sandi baru untuk pengguna ini:');
    if (!newPass) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/reset-password`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId: userId, newPassword: newPass })
      });
      if (!res.ok) throw new Error('Gagal me-reset kata sandi');
      showToast('Sandi berhasil diubah!', 'success');
    } catch (err: any) { setErrorMsg(err.message); showToast(err.message, 'error'); }
  };

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

        {errorMsg && (
          <div className="mb-6 skew-x-[-2deg] animate-in fade-in zoom-in bg-red-950/50 border-l-4 border-red-500 p-4 shadow-[4px_4px_0_0_#000]">
            <p className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {errorMsg}
            </p>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'overview' && <AdminMetrics metrics={metrics} />}

          {activeTab === 'announcements' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminAnnouncements token={token || ''} baseUrl={API_BASE_URL} />
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminLeaderboard data={leaderboard} />
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminTickets tickets={tickets} loading={loading} onGenerate={generateTicket} onPurge={purgeTickets} onRevoke={revokeTicket} />
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="bg-[#1a1a1a] p-4 md:p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] relative">
              <AdminUsers users={users} onToggleSuspend={toggleSuspend} onResetPassword={resetPassword} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
