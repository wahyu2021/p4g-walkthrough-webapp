import { ShieldAlert, ShieldCheck, KeyRound, Monitor, Clock } from 'lucide-react';
import type { User } from '../../../types/admin';

type AdminUsersProps = {
  users: User[];
  onToggleSuspend: (userId: string, currentStatus: string) => void;
  onResetPassword: (userId: string) => void;
};

// Fungsi kecil untuk memotong panjang teks user-agent
const formatUserAgent = (ua?: string) => {
  if (!ua) return 'Tidak Diketahui';
  if (ua.includes('Chrome')) return 'Google Chrome';
  if (ua.includes('Firefox')) return 'Mozilla Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari';
  if (ua.includes('Edge')) return 'Microsoft Edge';
  return ua.substring(0, 20) + '...';
};

export function AdminUsers({ users, onToggleSuspend, onResetPassword }: AdminUsersProps) {
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
                    {u.status === 'suspended' ? 'Terbekukan' : 'Aktif'}
                  </span>
                </td>
                <td className="p-4 text-xs font-mono text-gray-400">
                  {u.lastLoginAt ? (
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(u.lastLoginAt).toLocaleDateString('en-GB')}</span>
                      <span className="text-[10px] text-gray-500">{new Date(u.lastLoginAt).toLocaleTimeString('en-GB')}</span>
                    </div>
                  ) : (
                    <span className="text-gray-600 italic">Belum pernah login</span>
                  )}
                </td>
                <td className="p-4 text-xs font-mono text-gray-400">
                  {u.lastIp ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-p4-yellow font-black">{u.lastIp}</span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 truncate max-w-[150px]" title={u.lastUserAgent}>
                        <Monitor className="w-3 h-3" /> {formatUserAgent(u.lastUserAgent)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {u.username !== 'Yuu' && (
                      <>
                        <button 
                          onClick={() => onToggleSuspend(u._id, u.status || 'active')}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border transition-colors ${u.status === 'suspended' ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
                        >
                          {u.status === 'suspended' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                          {u.status === 'suspended' ? 'Pulihkan' : 'Bekukan'}
                        </button>
                        <button 
                          onClick={() => onResetPassword(u._id)}
                          className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <KeyRound className="w-3 h-3" />
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
