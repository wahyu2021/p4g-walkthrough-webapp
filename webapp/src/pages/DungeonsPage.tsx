import { useMemo } from 'react';
import { getDungeons } from '../utils/dataFetcher';
import { DungeonCard } from '../components/molecules/DungeonCard';

export function DungeonsPage() {
  const dungeons = useMemo(() => getDungeons(), []);

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-p4-black border-l-8 border-p4-yellow p-6 mb-4 relative overflow-hidden">
        {/* Decorative TV lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />
        
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter relative z-10">
          Midnight <span className="text-p4-yellow">Dungeons</span>
        </h2>
        <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest relative z-10">
          Rescue victims and clear shadows before the deadline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dungeons.map((dungeon) => (
          <DungeonCard key={dungeon.id} dungeon={dungeon} />
        ))}
      </div>
      
      {/* Disclaimer/Warning */}
      <div className="bg-red-900/10 border-2 border-red-900/30 p-6 mt-8">
        <h4 className="text-red-500 font-black uppercase text-xs tracking-widest mb-2 italic">⚠️ Warning: The Fog is Coming</h4>
        <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold">
          Failure to clear a dungeon before its deadline will result in a Game Over. 
          Make sure to manage your days effectively between Social Links and Exploration.
        </p>
      </div>
    </div>
  );
}
