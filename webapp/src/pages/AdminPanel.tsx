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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      await fetchTickets(); 
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-p4-black text-white p-4 md:p-12 relative overflow-hidden flex flex-col items-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111 25%, transparent 25%, transparent 75%, #111 75%, #111), repeating-linear-gradient(45deg, #111 25%, #222 25%, #222 75%, #111 75%, #111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-p4-yellow/10 to-transparent pointer-events-none mix-blend-overlay"></div>

      <div className="w-full max-w-5xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-white/5 backdrop-blur-md p-6 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] skew-x-[-3deg] hover:-translate-y-1 transition-transform duration-300">
          <div className="skew-x-[3deg]">
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-p4-yellow to-white uppercase tracking-widest drop-shadow-[2px_2px_0_#000]">
              Command Center
            </h1>
            <p className="text-p4-gray text-xs md:text-sm font-bold tracking-[0.3em] uppercase mt-2 border-b border-p4-gray/30 pb-2 inline-block">
              Secure Ticketing Network
            </p>
          </div>
          <Link to="/" className="mt-6 md:mt-0 group relative px-6 py-3 bg-p4-black border-2 border-p4-yellow skew-x-[3deg] overflow-hidden flex items-center justify-center transition-all hover:scale-105">
            <span className="absolute inset-0 bg-p4-yellow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            <span className="relative text-p4-yellow group-hover:text-p4-black font-black uppercase tracking-widest text-sm z-10 transition-colors">
              Return to Grid
            </span>
          </Link>
        </div>

        {/* Control Panel */}
        <div className="bg-[#1a1a1a] p-8 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] skew-x-[-2deg] relative group transition-all duration-500 hover:shadow-[12px_12px_0_0_#000]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-p4-yellow/10 rounded-bl-full pointer-events-none transform origin-top-right transition-transform group-hover:scale-150"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 skew-x-[2deg] relative z-10 border-b-2 border-p4-yellow/30 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-3 h-3 bg-p4-yellow inline-block animate-pulse"></span>
                Master Ticket Registry
              </h2>
              <p className="text-p4-gray text-xs font-mono uppercase tracking-widest mt-1">Total Minted: {tickets.length}</p>
            </div>
            
            <button 
              onClick={generateTicket}
              disabled={loading}
              className="mt-6 md:mt-0 relative px-6 py-3 bg-p4-yellow text-p4-black font-black uppercase tracking-widest hover:bg-white hover:shadow-[0_0_15px_rgba(255,235,59,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 border border-p4-yellow scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></div>
              {loading ? 'Processing...' : '+ Mint New Ticket'}
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 skew-x-[2deg] animate-in fade-in zoom-in bg-red-950/50 border-l-4 border-red-500 p-4">
              <p className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="text-xl">⚠</span> {errorMsg}
              </p>
            </div>
          )}

          {/* Data Grid */}
          <div className="skew-x-[2deg] grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tickets.length === 0 ? (
              <div className="col-span-full p-12 text-center border-2 border-dashed border-p4-gray/30 text-p4-gray uppercase tracking-widest font-black text-lg">
                No tickets established in the network.
              </div>
            ) : (
              tickets.map((t, idx) => (
                <div 
                  key={t._id} 
                  className={`relative p-5 border-2 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col gap-3 group overflow-hidden ${
                    t.isUsed ? 'border-red-900/50 bg-[#111] opacity-70' : 'border-p4-gray/50 bg-[#222] hover:border-p4-yellow cursor-pointer'
                  }`}
                  onClick={() => !t.isUsed && copyToClipboard(t.code, t._id)}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 px-2 py-1 bg-p4-black border-l border-b border-p4-gray/30 text-[9px] font-mono text-p4-gray">
                    {new Date(t.createdAt).toLocaleDateString('en-GB')}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex justify-between items-start mt-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${
                      t.isUsed ? 'bg-red-500 text-white' : 'bg-p4-yellow text-p4-black shadow-[0_0_10px_rgba(255,235,59,0.3)]'
                    }`}>
                      {t.isUsed ? 'Consumed' : 'Ready'}
                    </span>
                  </div>

                  {/* Code Reveal */}
                  <div className="mt-2 relative">
                    <div className="text-p4-gray text-[10px] uppercase font-black tracking-widest mb-1">Access Code</div>
                    <div className={`font-mono text-xl font-black tracking-widest transition-colors ${t.isUsed ? 'text-red-500 line-through' : 'text-white group-hover:text-p4-yellow'}`}>
                      {t.code}
                    </div>
                  </div>

                  {/* Action/User Info */}
                  <div className="mt-auto pt-3 border-t border-p4-gray/20 flex justify-between items-end min-h-[40px]">
                    {t.isUsed ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-p4-gray uppercase tracking-widest font-bold">Bound to:</span>
                        <span className="text-red-400 font-black uppercase tracking-widest text-sm">{t.usedBy}</span>
                      </div>
                    ) : (
                      <div className="flex-1 text-center">
                        <span className={`text-xs font-black tracking-widest uppercase transition-colors ${copiedId === t._id ? 'text-green-400' : 'text-p4-gray group-hover:text-p4-yellow'}`}>
                          {copiedId === t._id ? '✓ Copied' : 'Click to Copy'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover Glitch Effect Element */}
                  {!t.isUsed && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none mix-blend-overlay transition-opacity duration-300"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
