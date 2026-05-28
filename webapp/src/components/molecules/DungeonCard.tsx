import type { Dungeon } from '../../types/walkthrough';

interface DungeonCardProps {
  dungeon: Dungeon;
}

export function DungeonCard({ dungeon }: DungeonCardProps) {
  // Casting to unknown then to specific interface to avoid 'any' lint error
  const dungeonData = dungeon as unknown as { 
    is_golden_exclusive?: boolean; 
    is_true_ending?: boolean; 
    is_optional?: boolean;
    order: number;
    name: string;
    deadline: string;
    floors_count: number;
  };

  const isGoldenExclusive = dungeonData.is_golden_exclusive;
  const isTrueEnding = dungeonData.is_true_ending;
  const isOptional = dungeonData.is_optional;

  return (
    <div 
      className="relative group bg-[#2a2a2a] border-2 border-p4-black p-5 transition-all hover:-translate-y-1 shadow-[6px_6px_0px_0px_#111111]"
      style={{ clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-p4-black px-4 py-1 border-l-4 border-p4-yellow">
          <span className="text-[10px] text-gray-500 uppercase font-black block leading-none">Dungeon</span>
          <span className="text-p4-yellow font-black italic uppercase tracking-tighter text-lg">#{dungeon.order}</span>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {isGoldenExclusive && (
            <span className="bg-p4-yellow text-p4-black px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm">
              Golden Exclusive
            </span>
          )}
          {isTrueEnding && (
            <span className="bg-red-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm">
              True Ending
            </span>
          )}
          {isOptional && (
            <span className="bg-blue-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm">
              Optional
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6 leading-tight group-hover:text-p4-yellow transition-colors">
        {dungeon.name}
      </h3>
      
      <div className="bg-p4-black/50 p-4 border border-p4-gray/30">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Clear Deadline</span>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-black italic tracking-tighter ${dungeon.deadline === 'N/A' ? 'text-gray-600' : 'text-p4-yellow'}`}>
              {dungeon.deadline}
            </span>
            {dungeon.deadline !== 'N/A' && (
              <span className="text-[10px] text-white/40 font-bold uppercase">Before Day Ends</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
        <span>Floors: {dungeon.floors_count || '??'}</span>
        <button className="hover:text-p4-yellow transition-colors cursor-not-allowed">
          Details Locked →
        </button>
      </div>
    </div>
  );
}
