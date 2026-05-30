import React from 'react';
import type { DungeonBoss } from '../../types/walkthrough';
import { AffinityBadge } from '../atoms/AffinityBadge';

interface BossRowProps {
  boss: DungeonBoss;
  isMiniBoss?: boolean;
}

export function BossRow({ boss, isMiniBoss = false }: BossRowProps) {
  return (
    <div className={`flex flex-col p-5 sm:p-6 mb-4 ${isMiniBoss ? 'bg-[#222] border-l-4 border-gray-500' : 'bg-red-950/20 border-l-4 border-red-600'} hover:brightness-110 transition-all shadow-md`}>
      <div className="flex flex-col mb-4">
        <div className="flex items-center space-x-3 mb-2">
          {isMiniBoss ? (
            <span className="text-[10px] bg-gray-600 text-white px-2.5 py-1 uppercase font-black tracking-widest rounded-sm">Mini Boss</span>
          ) : (
            <span className="text-[10px] bg-red-600 text-white px-2.5 py-1 uppercase font-black tracking-widest rounded-sm animate-pulse">Boss</span>
          )}
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{boss.floor}</span>
        </div>
        
        <h4 className={`font-black uppercase tracking-tight text-xl sm:text-2xl leading-tight ${isMiniBoss ? 'text-white' : 'text-red-400'}`}>
          {boss.boss}
        </h4>
        
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase font-bold text-gray-400 mt-2">
          <span>Lv. <span className="text-white">{boss.lv}</span></span>
          {boss.hp && <span>HP <span className="text-white">{boss.hp}</span></span>}
          {boss.sp && <span>SP <span className="text-white">{boss.sp}</span></span>}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 max-w-lg">
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
