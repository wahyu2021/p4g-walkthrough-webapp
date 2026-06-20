import { ShieldAlert, ShieldCheck, KeyRound, Monitor, Clock, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProgress } from '../../../hooks/useProgress';
import { useUi } from '../../../context/UiContext';
import type { User } from '../../../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const formatUserAgent = (ua?: string) => {
  if (!ua) return 'Tidak Diketahui';
  if (ua.includes('Chrome')) return 'Google Chrome';
  if (ua.includes('Firefox')) return 'Mozilla Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari';
  if (ua.includes('Edge')) return 'Microsoft Edge';
  return ua.substring(0, 20) + '...';
};

export function AdminUsers() {
  const { token } = useProgress();
  const { showToast, showConfirm } = useUi();
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal memuat pengguna');
      const data = await res.json();
      return (data.users || []) as User[];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string, newStatus: string }) => {
      const res = await fetch(`${API_BASE_URL}/admin/users/suspend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newStatus })
      });
      if (!res.ok) throw new Error('Akses ditolak atau gagal mengubah status');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
      showToast(`Status berhasil diubah menjadi ${variables.newStatus}.`, 'success');
    },
    onError: (err: any) => showToast(err.message, 'error')
  });

  const resetMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string, newPassword: string }) => {
      const res = await fetch(`${API_BASE_URL}/admin/users/reset-password`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newPassword })
      });
      if (!res.ok) throw new Error('Gagal me-reset kata sandi');
    },
    onSuccess: () => showToast('Sandi berhasil diubah!', 'success'),
    onError: (err: any) => showToast(err.message, 'error')
  });

  const toggleSuspend = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const isConfirmed = await showConfirm({
      title: 'Ubah Status',
      message: `Ubah status pengguna ini menjadi ${newStatus}?`,
      isDestructive: newStatus === 'suspended',
      confirmText: 'Ubah Status'
    });
    if (isConfirmed) suspendMutation.mutate({ userId, newStatus });
  };

  const resetPassword = (userId: string) => {
    const newPass = window.prompt('Masukkan kata sandi baru untuk pengguna ini:');
    if (newPass) resetMutation.mutate({ userId, newPassword: newPass });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-p4-yellow">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-black tracking-widest uppercase text-sm">Menyusun Data Pengguna...</p>
      </div>
    );
  }

  if (isError || !users) {
    return <div className="text-center p-8 text-red-500 uppercase tracking-widest font-bold">Gagal memuat data pengguna.</div>;
  }

  return (
    <div className="skew-x-[2deg]">
      <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 border-b-2 border-p4-yellow/30 pb-6 mb-8">
        <span className="w-3 h-3 bg-blue-500 inline-block animate-pulse"></span>
        Manajemen Pengguna Terdaftar
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-y-2 border-gray-600 text-xs uppercase tracking-widest text-gray-400">
              <th className="p-4">Identitas</th>
              <th className="p-4">Status</th>
              <th className="p-4">Pencapaian</th>
              <th className="p-4">Kunjungan Terakhir</th>
              <th className="p-4">Perangkat & Jaringan</th>
              <th className="p-4 text-right">Tindakan Khusus</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-800 hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-black text-white">{u.username}</div>
                  <span className={`px-1.5 py-0.5 mt-1 inline-block text-[8px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-p4-yellow text-p4-black' : 'bg-gray-800 text-gray-300'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-1 ${u.status === 'suspended' ? 'bg-red-500 text-white' : 'text-green-400'}`}>
                    {u.status === 'suspended' ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    {u.status === 'suspended' ? 'Dibekukan' : 'Aktif'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-white">{u.progressDays || 0} Hari</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">Terselesaikan</div>
                </td>
                <td className="p-4 text-xs text-gray-300 font-mono flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-p4-yellow" />
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Belum Login'}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-cyan-400 font-mono tracking-wider">{u.lastIp || 'Unknown IP'}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase font-bold tracking-widest">
                      <Monitor className="w-3 h-3" /> {formatUserAgent(u.lastUserAgent)}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleSuspend(u._id, u.status || 'active')}
                      className={`p-2 rounded-sm border transition-colors ${u.status === 'suspended' ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                      title={u.status === 'suspended' ? 'Pulihkan Akun' : 'Bekukan Akun'}
                    >
                      {u.status === 'suspended' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => resetPassword(u._id)}
                      className="p-2 rounded-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                      title="Reset Kata Sandi"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center p-8 text-gray-500 uppercase tracking-widest font-bold">Belum ada pemain yang terdaftar.</div>
        )}
      </div>
    </div>
  );
}
