import { ShieldAlert, ShieldCheck, KeyRound } from 'lucide-react';
import type { User } from '../../../types/admin';

type AdminUsersProps = {
  users: User[];
  onToggleSuspend: (userId: string, currentStatus: string) => void;
  onResetPassword: (userId: string) => void;
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
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-1 ${u.status === 'suspended' ? 'bg-red-500 text-white' : 'text-green-400'}`}>
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
  );
}
