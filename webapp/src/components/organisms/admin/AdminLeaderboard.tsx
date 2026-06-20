import { Trophy, Medal } from 'lucide-react';
import type { LeaderboardEntry } from '../../../types/admin';

export function AdminLeaderboard({ data }: { data: LeaderboardEntry[] }) {
  if (!data || data.length === 0) return <div className="text-center p-8 text-gray-500 uppercase tracking-widest font-bold">Belum ada data progres pemain.</div>;

  return (
    <div className="skew-x-[2deg]">
      <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 border-b-2 border-p4-yellow/30 pb-6 mb-8">
        <Trophy className="w-5 h-5 text-p4-yellow" />
        Papan Peringkat (Leaderboard)
      </h2>
      <div className="flex flex-col gap-3">
        {data.map((user) => (
          <div key={user.username} className={`flex items-center justify-between p-4 border-l-4 ${user.rank === 1 ? 'bg-p4-yellow/10 border-p4-yellow shadow-[0_0_15px_rgba(255,235,59,0.2)]' : user.rank === 2 ? 'bg-gray-400/10 border-gray-400' : user.rank === 3 ? 'bg-amber-700/10 border-amber-700' : 'bg-white/5 border-gray-700'} transition-all`}>
            <div className="flex items-center gap-4">
              <span className={`text-2xl font-black ${user.rank === 1 ? 'text-p4-yellow drop-shadow-[2px_2px_0_#000]' : 'text-gray-500'}`}>
                #{user.rank}
              </span>
              <div>
                <div className="font-black text-lg text-white flex items-center gap-2">
                  {user.username} 
                  {user.rank === 1 && <Medal className="w-4 h-4 text-p4-yellow" />}
                </div>
                {user.rank === 1 && <div className="text-[10px] text-p4-yellow font-bold uppercase tracking-widest">Izanagi Champion</div>}
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white">{user.score}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest ml-2">Hari Selesai</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
