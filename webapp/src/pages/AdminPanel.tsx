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

export function AdminPanel() {
  const { role, token } = useProgress();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Gatekeeper Frontend: Jika bukan admin, tendang ke beranda
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal memuat tiket');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    if (role === 'admin' && token) {
      fetchTickets();
    }
  }, [role, token]);

  const generateTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invite/generate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mencetak tiket baru');
      await fetchTickets(); // Refresh data
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'admin') return null; // Layar kosong saat proses tendang (redirect)

  return (
    <div className="min-h-screen bg-p4-black text-white p-8" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-[#2a2a2a] p-4 border-l-4 border-p4-yellow shadow-[4px_4px_0_0_#000] skew-x-[-2deg]">
          <div>
            <h1 className="text-3xl font-black text-p4-yellow uppercase tracking-widest skew-x-[2deg]">Admin Panel</h1>
            <p className="text-p4-gray text-xs tracking-widest uppercase skew-x-[2deg] mt-1">Ticket Generation System</p>
          </div>
          <Link to="/" className="bg-p4-yellow text-p4-black px-4 py-2 font-black tracking-widest uppercase hover:bg-white transition-colors skew-x-[2deg]">
            Back to App
          </Link>
        </div>

        <div className="bg-[#2a2a2a] p-6 border-l-4 border-p4-yellow shadow-[4px_4px_0_0_#000] skew-x-[-2deg]">
          <div className="flex justify-between items-center mb-6 skew-x-[2deg]">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Master Ticket List</h2>
            <button 
              onClick={generateTicket}
              disabled={loading}
              className="bg-p4-yellow hover:bg-white text-p4-black px-4 py-2 font-black uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {loading ? 'Printing...' : '+ Print New Ticket'}
            </button>
          </div>

          {errorMsg && <p className="text-red-500 mb-4 skew-x-[2deg] font-bold">{errorMsg}</p>}

          <div className="overflow-x-auto skew-x-[2deg]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-p4-black text-p4-yellow uppercase text-xs tracking-widest">
                  <th className="p-3 border-b-2 border-p4-gray">Invite Code</th>
                  <th className="p-3 border-b-2 border-p4-gray">Status</th>
                  <th className="p-3 border-b-2 border-p4-gray">Used By</th>
                  <th className="p-3 border-b-2 border-p4-gray">Created At</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-p4-gray uppercase tracking-widest font-bold">Belum ada tiket yang dicetak.</td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t._id} className="border-b border-p4-gray/30 hover:bg-p4-black/50 transition-colors">
                      <td className="p-3 font-mono text-lg font-bold text-white tracking-widest">{t.code}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs font-black uppercase tracking-widest ${t.isUsed ? 'bg-red-500 text-white' : 'bg-green-500 text-p4-black'}`}>
                          {t.isUsed ? 'HANGUS' : 'AKTIF'}
                        </span>
                      </td>
                      <td className="p-3 text-p4-yellow font-bold uppercase">{t.usedBy || '-'}</td>
                      <td className="p-3 text-p4-gray text-xs font-mono">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
