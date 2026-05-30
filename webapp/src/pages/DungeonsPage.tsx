import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getDungeons } from '../utils/dataFetcher';
import { DungeonDetail } from '../components/organisms/DungeonDetail';

export function DungeonsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const dungeons = useMemo(() => getDungeons(), []);

  // Use the slug to find the specific dungeon, or default to the first one if not found
  const activeDungeon = useMemo(() => {
    if (!slug) return null;
    return dungeons.find(d => d.id === slug);
  }, [dungeons, slug]);

  // If no slug is provided or it's an invalid slug, redirect to the first dungeon
  if (!slug || (!activeDungeon && dungeons.length > 0)) {
    return <Navigate to={`/dungeons/${dungeons[0].id}`} replace />;
  }

  if (!activeDungeon) {
    return <div>No dungeons found.</div>;
  }

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Header */}
      <div className="bg-p4-black border-l-8 border-p4-yellow p-6 mb-6 relative overflow-hidden flex flex-col sm:flex-row justify-between sm:items-end">
        {/* Decorative TV lines effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />

        <div className="mb-2 sm:mb-0">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter relative z-10">       
            Midnight <span className="text-p4-yellow">Dungeons</span>
          </h2>
          <p className="text-gray-400 text-xs mt-2 uppercase font-bold tracking-widest relative z-10">
            Rescue victims and clear shadows before the deadline.
          </p>
        </div>
      </div>

      {/* Selected Dungeon Detail */}
      <div key={activeDungeon.id}>
        <DungeonDetail dungeon={activeDungeon} />
      </div>

      {/* Disclaimer/Warning */}
      <div className="bg-red-900/10 border-2 border-red-900/30 p-6 mt-12">
        <h4 className="text-red-500 font-black uppercase text-xs tracking-widest mb-2 italic">⚠️ Warning: The Fog is Coming</h4>
        <p className="text-[10px] text-gray-400 leading-relaxed uppercase font-bold">
          Failure to clear a dungeon before its deadline will result in a Game Over.
          Make sure to manage your days effectively between Social Links and Exploration.
        </p>
      </div>
    </div>
  );
}
