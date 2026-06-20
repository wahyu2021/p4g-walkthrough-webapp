import { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

import type { Ticket, User, Metrics } from '../types/admin';
import { AdminMetrics } from '../components/organisms/admin/AdminMetrics';
import { AdminTickets } from '../components/organisms/admin/AdminTickets';
import { AdminUsers } from '../components/organisms/admin/AdminUsers';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export function AdminPanel() {
  const { role, token } = useProgress();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'tickets' | 'users'>('tickets');

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
    } catch (err: any) { setErrorMsg(err.message); } 
    finally { setLoading(false); }
  };

  const revokeTicket = async (ticketId: string) => {
    if (!window.confirm('Hancurkan tiket ini secara permanen?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/revoke`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId })
      });
      if (!res.ok) throw new Error('Gagal menghanguskan tiket');
      await fetchData(); 
    } catch (err: any) { setErrorMsg(err.message); }
  };

  const purgeTickets = async () => {
    if (!window.confirm('PERINGATAN: Lenyapkan seluruh tiket usang/hangus dari database secara permanen?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/purge`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Gagal membersihkan tiket');
      await fetchData(); 
    } catch (err: any) { setErrorMsg(err.message); }
  };

  const toggleSuspend = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Ubah status pengguna ini menjadi ${newStatus}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/suspend`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId: userId, newStatus })
      });
      if (!res.ok) throw new Error('Akses ditolak atau gagal mengubah status');
      await fetchData();
    } catch (err: any) { setErrorMsg(err.message); }
  };

  const resetPassword = async (userId: string) => {
    const newPass = window.prompt('Masukkan kata sandi baru untuk pengguna ini:');
    if (!newPass) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/reset-password`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ targetUserId: userId, newPassword: newPass })
      });
      if (!res.ok) throw new Error('Gagal me-reset kata sandi');
      alert('Sandi berhasil diubah!');
    } catch (err: any) { setErrorMsg(err.message); }
  };

  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-p4-black text-white p-4 md:p-12 relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-p4-yellow/10 to-transparent pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-6xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white/5 backdrop-blur-md p-6 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] skew-x-[-3deg]">
          <div className="skew-x-[3deg]">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-p4-yellow to-white uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">
              Admin Panel
            </h1>
            <p className="text-gray-300 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mt-2 border-b border-gray-500/30 pb-2 inline-block">
              Dasbor Manajemen & Analitik Utama
            </p>
          </div>
          <Link to="/" className="mt-6 md:mt-0 group relative px-6 py-3 bg-p4-black border-2 border-p4-yellow skew-x-[3deg] overflow-hidden flex items-center justify-center transition-all hover:scale-105">
            <span className="absolute inset-0 bg-p4-yellow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            <span className="relative text-p4-yellow group-hover:text-p4-black font-black uppercase tracking-widest text-sm z-10 transition-colors">
              Kembali ke Beranda
            </span>
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 skew-x-[-2deg] animate-in fade-in zoom-in bg-red-950/50 border-l-4 border-red-500 p-4 shadow-[4px_4px_0_0_#000]">
            <p className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {errorMsg}
            </p>
          </div>
        )}

        <AdminMetrics metrics={metrics} />

        <div className="flex gap-4 mb-6 skew-x-[-2deg]">
          <button 
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-p4-yellow text-p4-black shadow-[4px_4px_0_0_#000]' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-600'}`}
          >
            Sistem Tiket
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-p4-yellow text-p4-black shadow-[4px_4px_0_0_#000]' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-600'}`}
          >
            Manajemen Pengguna
          </button>
        </div>

        <div className="bg-[#1a1a1a] p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] skew-x-[-2deg] relative">
          {activeTab === 'tickets' && (
            <AdminTickets 
              tickets={tickets} 
              loading={loading} 
              onGenerate={generateTicket} 
              onPurge={purgeTickets} 
              onRevoke={revokeTicket} 
            />
          )}
          
          {activeTab === 'users' && (
            <AdminUsers 
              users={users} 
              onToggleSuspend={toggleSuspend} 
              onResetPassword={resetPassword} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
