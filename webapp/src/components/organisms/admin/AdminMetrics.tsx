import { Users, Ticket as TicketIcon, TicketX, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Metrics } from '../../../types/admin';

type AdminMetricsProps = { metrics: Metrics | null };

export function AdminMetrics({ metrics }: AdminMetricsProps) {
  if (!metrics) return null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 skew-x-[-2deg]">
        <div className="bg-[#1a1a1a] border border-p4-yellow/30 p-4 border-l-4 border-l-p4-yellow flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-p4-yellow/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <Users className="w-8 h-8 text-p4-yellow opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Populasi Pengguna</span>
          <span className="text-3xl font-black text-white">{metrics.totalUsers}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-blue-500/30 p-4 border-l-4 border-l-blue-500 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <TicketIcon className="w-8 h-8 text-blue-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Tiket Tersedia</span>
          <span className="text-3xl font-black text-white">{metrics.activeTickets}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-red-500/30 p-4 border-l-4 border-l-red-500 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <TicketX className="w-8 h-8 text-red-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Tiket Hangus</span>
          <span className="text-3xl font-black text-white">{metrics.usedTickets}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-green-500/30 p-4 border-l-4 border-l-green-500 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <Activity className="w-8 h-8 text-green-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Rata-rata Progress</span>
          <span className="text-3xl font-black text-white">{metrics.avgDays} <span className="text-sm text-gray-500">Hari</span></span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-6 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000] skew-x-[-2deg] mb-8">
        <h3 className="text-white uppercase tracking-widest font-black mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-p4-yellow" />
          Statistik Aktivitas Pemain (Penyelesaian Panduan)
        </h3>
        <div className="h-[250px] w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height={250} minHeight={250}>
            <BarChart data={metrics.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
              <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#ffd700', borderRadius: 0, textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
                itemStyle={{ color: '#ffd700' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="Pemain" fill="#ffd700" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
