import React from 'react';
import type { DungeonBoss } from '../../types/walkthrough';
import { AffinityBadge } from '../atoms/AffinityBadge';

interface BossRowProps {
  boss: DungeonBoss;
  isMiniBoss?: boolean;
}

export function BossRow({ boss, isMiniBoss = false }: BossRowProps) {
  return (
    <div className={`flex flex-col p-4 mb-3 ${isMiniBoss ? 'bg-[#222] border-l-2 border-gray-500' : 'bg-red-950/20 border-l-2 border-red-600'} hover:brightness-110 transition-all`}>
      <div className="flex flex-col mb-3">
        <div className="flex items-center space-x-2 mb-1.5">
          {isMiniBoss ? (
            <span className="text-[9px] bg-gray-600 text-white px-2 py-0.5 uppercase font-black tracking-widest rounded-sm">Mini Boss</span>
          ) : (
            <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 uppercase font-black tracking-widest rounded-sm animate-pulse">Boss</span>
          )}
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{boss.floor}</span>
        </div>
        
        <h4 className={`font-black uppercase tracking-tight text-lg sm:text-xl leading-tight ${isMiniBoss ? 'text-white' : 'text-red-400'}`}>
          {boss.boss}
        </h4>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase font-bold text-gray-400 mt-1.5">
          <span>Lv. <span className="text-white">{boss.lv}</span></span>
          {boss.hp && <span>HP <span className="text-white">{boss.hp}</span></span>}
          {boss.sp && <span>SP <span className="text-white">{boss.sp}</span></span>}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 max-w-[300px]">
        <AffinityBadge element="Phy" affinity={boss.phy} />
        <AffinityBadge element="Fir" affinity={boss.fir} />
        <AffinityBadge element="Ice" affinity={boss.ice} />
        <AffinityBadge element="Elc" affinity={boss.elc} />
        <AffinityBadge element="Wnd" affinity={boss.wnd} />
        <AffinityBadge element="Lgt" affinity={boss.lgt} />
        <AffinityBadge element="Drk" affinity={boss.drk} />
      </div>
    </div>
  );
}
