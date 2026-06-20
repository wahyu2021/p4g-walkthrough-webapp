import { useState, useEffect } from 'react';
import { useProgress } from '../hooks/useProgress';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

type Ticket = {
  _id: string;
  code: string;
  isUsed: boolean;
  usedBy: string | null;
  createdBy: string;
  createdAt: string;
};

type User = {
  _id: string;
  username: string;
  role: string;
  status?: string;
  createdAt?: string;
};

type Metrics = {
  totalUsers: number;
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  avgDays: number;
};

export function AdminPanel() {
  const { role, token } = useProgress();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Tab State: 'tickets' | 'users'
  const [activeTab, setActiveTab] = useState<'tickets' | 'users'>('tickets');

  useEffect(() => {
    if (role !== 'admin') navigate('/');
  }, [role, navigate]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch Metrics
      const mRes = await fetch(`${API_BASE_URL}/admin/metrics`, { headers });
      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData);
      }

      // Fetch Tickets
      const tRes = await fetch(`${API_BASE_URL}/admin/invite/list`, { headers });
      if (tRes.ok) {
        const tData = await tRes.json();
        setTickets(tData.tickets || []);
      }

      // Fetch Users
      const uRes = await fetch(`${API_BASE_URL}/admin/users`, { headers });
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData.users || []);
      }
    } catch (err: any) {
      setErrorMsg('Gagal memuat data dari peladen.');
    }
  };

  useEffect(() => {
    if (role === 'admin' && token) fetchData();
  }, [role, token]);

  // ================= TICKET ACTIONS =================
  const generateTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mencetak tiket baru');
      await fetchData(); 
    } catch (err: any) { setErrorMsg(err.message); } 
    finally { setLoading(false); }
  };

  const revokeTicket = async (ticketId: string) => {
    if (!window.confirm('Hancurkan tiket ini secara permanen?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/revoke`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      });
      if (!res.ok) throw new Error('Gagal menghanguskan tiket');
      await fetchData(); 
    } catch (err: any) { setErrorMsg(err.message); }
  };

  const purgeTickets = async () => {
    if (!window.confirm('PERINGATAN: Lenyapkan seluruh tiket usang/hangus dari database secara permanen?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/purge`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal membersihkan tiket');
      await fetchData(); 
    } catch (err: any) { setErrorMsg(err.message); }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ================= USER ACTIONS =================
  const toggleSuspend = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    if (!window.confirm(`Ubah status pengguna ini menjadi ${newStatus}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/suspend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newStatus })
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
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newPassword: newPass })
      });
      if (!res.ok) throw new Error('Gagal me-reset kata sandi');
      alert('Sandi berhasil diubah!');
    } catch (err: any) { setErrorMsg(err.message); }
  };

  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-p4-black text-white p-4 md:p-12 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-p4-yellow/10 to-transparent pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-6xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
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
              <span className="text-xl">⚠</span> {errorMsg}
            </p>
          </div>
        )}

        {/* ================= METRICS DASHBOARD ================= */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 skew-x-[-2deg]">
            <div className="bg-[#1a1a1a] border border-p4-yellow/30 p-4 border-l-4 border-l-p4-yellow flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-p4-yellow/5 rounded-full group-hover:scale-150 transition-transform"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Populasi Pengguna</span>
              <span className="text-3xl font-black text-white">{metrics.totalUsers}</span>
            </div>
            <div className="bg-[#1a1a1a] border border-blue-500/30 p-4 border-l-4 border-l-blue-500 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Tiket Tersedia</span>
              <span className="text-3xl font-black text-white">{metrics.activeTickets}</span>
            </div>
            <div className="bg-[#1a1a1a] border border-red-500/30 p-4 border-l-4 border-l-red-500 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Tiket Hangus</span>
              <span className="text-3xl font-black text-white">{metrics.usedTickets}</span>
            </div>
            <div className="bg-[#1a1a1a] border border-green-500/30 p-4 border-l-4 border-l-green-500 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Rata-rata Progress</span>
              <span className="text-3xl font-black text-white">{metrics.avgDays} <span className="text-sm text-gray-500">Hari</span></span>
            </div>
          </div>
        )}

        {/* ================= TABS NAVIGATION ================= */}
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
          
          {/* ================= TICKETS TAB ================= */}
          {activeTab === 'tickets' && (
            <div className="skew-x-[2deg]">
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 relative z-10 border-b-2 border-p4-yellow/30 pb-6">
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <span className="w-3 h-3 bg-p4-yellow inline-block animate-pulse"></span>
                    Daftar Tiket Undangan
                  </h2>
                </div>
                
                <div className="flex gap-4 mt-6 md:mt-0">
                  <button 
                    onClick={purgeTickets}
                    className="px-4 py-2 bg-red-950/50 border border-red-500 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 text-xs"
                  >
                    🗑 Bersihkan Sampah Tiket
                  </button>
                  <button 
                    onClick={generateTicket}
                    disabled={loading}
                    className="relative px-6 py-2 bg-p4-yellow text-p4-black font-black uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? 'Memproses...' : '+ Buat Tiket Baru'}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tickets.length === 0 ? (
                  <div className="col-span-full p-12 text-center border-2 border-dashed border-gray-500/50 text-gray-300 uppercase tracking-widest font-black text-lg">
                    Belum ada tiket yang dibuat.
                  </div>
                ) : (
                  tickets.map((t, idx) => (
                    <div 
                      key={t._id} 
                      className={`relative p-5 border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col gap-3 group overflow-hidden ${
                        t.isUsed ? 'border-red-900/50 bg-[#111] opacity-70' : 'border-white/20 bg-[#222] hover:border-p4-yellow'
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="absolute top-0 right-0 px-2 py-1 bg-p4-black border-l border-b border-white/20 text-[9px] font-mono text-gray-300 flex items-center gap-2">
                        {new Date(t.createdAt).toLocaleDateString('en-GB')}
                        {!t.isUsed && (
                          <button onClick={() => revokeTicket(t._id)} title="Hanguskan Tiket" className="text-gray-500 hover:text-red-500 transition-colors ml-2">
                            ✖
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between items-start mt-2">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                          t.isUsed ? 'bg-red-500 text-white' : 'bg-p4-yellow text-p4-black shadow-[0_0_10px_rgba(255,235,59,0.3)]'
                        }`}>
                          {t.isUsed ? 'Hangus' : 'Aktif'}
                        </span>
                      </div>

                      <div className="mt-2 relative">
                        <div className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Access Code</div>
                        <div 
                          onClick={() => !t.isUsed && copyToClipboard(t.code, t._id)}
                          className={`font-mono text-xl font-black tracking-widest transition-colors ${t.isUsed ? 'text-red-500 line-through' : 'text-white cursor-pointer hover:text-p4-yellow'}`}
                        >
                          {t.code}
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/10 flex justify-between items-end min-h-[40px]">
                        {t.isUsed ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Digunakan oleh:</span>
                            <span className="text-red-400 font-black uppercase tracking-widest text-sm">{t.usedBy}</span>
                          </div>
                        ) : (
                          <div className="flex-1 text-center">
                            <span className={`text-xs font-black tracking-widest uppercase transition-colors ${copiedId === t._id ? 'text-green-400' : 'text-gray-500'}`}>
                              {copiedId === t._id ? '✓ Tersalin' : 'Klik kode untuk salin'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= USERS TAB ================= */}
          {activeTab === 'users' && (
            <div className="skew-x-[2deg]">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 border-b-2 border-p4-yellow/30 pb-6 mb-8">
                <span className="w-3 h-3 bg-blue-500 inline-block animate-pulse"></span>
                Manajemen Pengguna Terdaftar
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-y-2 border-gray-600 text-xs uppercase tracking-widest text-gray-400">
                      <th className="p-4">Identitas (Username)</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Tanggal Daftar</th>
                      <th className="p-4 text-right">Tindakan Khusus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-gray-800 hover:bg-white/5 transition-colors group">
                        <td className="p-4 font-black text-white">{u.username}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-p4-yellow text-p4-black' : 'bg-gray-800 text-gray-300'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${u.status === 'suspended' ? 'bg-red-500 text-white' : 'text-green-400'}`}>
                            {u.status === 'suspended' ? 'Terbekukan' : 'Aktif'}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '-'}
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          {u.username !== 'Yuu' && (
                            <>
                              <button 
                                onClick={() => toggleSuspend(u._id, u.status || 'active')}
                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-colors ${u.status === 'suspended' ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
                              >
                                {u.status === 'suspended' ? 'Pulihkan' : 'Bekukan'}
                              </button>
                              <button 
                                onClick={() => resetPassword(u._id)}
                                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                              >
                                Reset Sandi
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
