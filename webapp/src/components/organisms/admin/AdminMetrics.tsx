import { Users, Ticket as TicketIcon, TicketX, Activity, UserCheck, UserX, PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useProgress } from '../../../hooks/useProgress';
import type { Metrics } from '../../../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export function AdminMetrics() {
  const { token } = useProgress();

  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mengambil metrik admin');
      return (await res.json()) as Metrics;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000 // Cache selama 5 menit
  });
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-p4-yellow">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-black tracking-widest uppercase text-sm">Menghitung Metrik...</p>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="font-black tracking-widest uppercase text-sm">Gagal memuat data metrik.</p>
      </div>
    );
  }
  // Data olahan untuk Pie Chart
  const ticketData = [
    { name: 'Tersedia', value: metrics.activeTickets, color: '#3b82f6' },
    { name: 'Hangus', value: metrics.usedTickets, color: '#ef4444' }
  ];

  const userData = [
    { name: 'Akun Aktif', value: metrics.totalUsers - metrics.suspendedUsers, color: '#10b981' },
    { name: 'Dibekukan', value: metrics.suspendedUsers, color: '#f97316' }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 skew-x-[-2deg]">
        <div className="bg-[#1a1a1a] border border-p4-yellow/30 p-4 border-l-4 border-l-p4-yellow flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-p4-yellow/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <Users className="w-8 h-8 text-p4-yellow opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Populasi Pengguna</span>
          <span className="text-3xl font-black text-white">{metrics.totalUsers}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-cyan-500/30 p-4 border-l-4 border-l-cyan-500 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-cyan-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <UserCheck className="w-8 h-8 text-cyan-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Pengunjung Hari Ini</span>
          <span className="text-3xl font-black text-white">{metrics.activeToday}</span>
        </div>
        <div className="bg-[#1a1a1a] border border-orange-500/30 p-4 border-l-4 border-l-orange-500 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <UserX className="w-8 h-8 text-orange-500 opacity-50 mb-2 group-hover:opacity-100 transition-opacity" />
          <span className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">Akun Dibekukan</span>
          <span className="text-3xl font-black text-white">{metrics.suspendedUsers}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 skew-x-[-2deg]">
        {/* Chart 1: Bar Chart (Aktivitas Pemain) */}
        <div className="bg-[#1a1a1a] p-6 border-l-4 border-p4-yellow shadow-[8px_8px_0_0_#000]">
          <h3 className="text-white uppercase tracking-widest font-black mb-6 flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-p4-yellow" />
            Distribusi Progress Pemain
          </h3>
          <div className="h-[250px] w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height={250} minHeight={250}>
              <BarChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#ffd700', borderRadius: 0, textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#ffd700' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="Pemain" fill="#ffd700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Komposisi Tiket & Akun (Pie Charts) */}
        <div className="bg-[#1a1a1a] p-6 border-l-4 border-cyan-500 shadow-[8px_8px_0_0_#000] flex flex-col md:flex-row items-center justify-around">
          <div className="w-full md:w-1/2 flex flex-col items-center">
             <h3 className="text-white uppercase tracking-widest font-black mb-2 flex items-center gap-2 text-xs">
              <PieChartIcon className="w-4 h-4 text-cyan-500" />
              Status Akun
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase mt-2">
              <span className="text-emerald-500">● Aktif: {userData[0].value}</span>
              <span className="text-orange-500">● Beku: {userData[1].value}</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center mt-8 md:mt-0">
             <h3 className="text-white uppercase tracking-widest font-black mb-2 flex items-center gap-2 text-xs">
              <TicketIcon className="w-4 h-4 text-blue-500" />
              Sirkulasi Tiket
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ticketData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                    {ticketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '12px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase mt-2">
              <span className="text-blue-500">● Sisa: {ticketData[0].value}</span>
              <span className="text-red-500">● Dipakai: {ticketData[1].value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
