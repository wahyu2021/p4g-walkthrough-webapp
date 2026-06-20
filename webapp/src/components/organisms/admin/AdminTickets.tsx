import { useState } from 'react';
import { Trash2, Copy, CheckCircle2, TicketPlus, ArchiveX } from 'lucide-react';
import type { Ticket } from '../../../types/admin';

type AdminTicketsProps = {
  tickets: Ticket[];
  loading: boolean;
  onGenerate: () => void;
  onPurge: () => void;
  onRevoke: (id: string) => void;
};

export function AdminTickets({ tickets, loading, onGenerate, onPurge, onRevoke }: AdminTicketsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
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
            onClick={onPurge}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/50 border border-red-500 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 text-xs"
          >
            <ArchiveX className="w-4 h-4" />
            Bersihkan Sampah
          </button>
          <button 
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center gap-2 relative px-6 py-2 bg-p4-yellow text-p4-black font-black uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <TicketPlus className="w-5 h-5" />
            {loading ? 'Memproses...' : 'Buat Tiket Baru'}
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
                  <button onClick={() => onRevoke(t._id)} title="Hanguskan Tiket" className="text-gray-500 hover:text-red-500 transition-colors ml-2">
                    <Trash2 className="w-3 h-3" />
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
                  className={`font-mono text-xl font-black tracking-widest transition-colors ${t.isUsed ? 'text-red-500 line-through' : 'text-white cursor-pointer hover:text-p4-yellow'} flex items-center gap-2`}
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
                    <span className={`flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase transition-colors ${copiedId === t._id ? 'text-green-400' : 'text-gray-500 group-hover:text-p4-yellow cursor-pointer'}`} onClick={() => copyToClipboard(t.code, t._id)}>
                      {copiedId === t._id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedId === t._id ? 'Tersalin' : 'Salin Kode'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
