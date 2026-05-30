import React from 'react';
import type { DungeonEnemy } from '../../types/walkthrough';
import { AffinityBadge } from '../atoms/AffinityBadge';

interface EnemyRowProps {
  enemy: DungeonEnemy;
}

export function EnemyRow({ enemy }: EnemyRowProps) {
  return (
    <div className="flex flex-col p-4 sm:p-5 bg-[#222] border-l-4 border-[#444] hover:border-p4-yellow hover:bg-[#2a2a2a] transition-colors group mb-2 shadow-sm">
      <div className="flex flex-col mb-4">
        <h4 className="text-white font-black uppercase tracking-tight text-lg sm:text-xl group-hover:text-p4-yellow transition-colors leading-tight">
          {enemy.enemy}
        </h4>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase font-bold text-gray-400 mt-2">
          <span>Lv. <span className="text-white">{enemy.lv}</span></span>
          {enemy.hp && <span>HP <span className="text-white">{enemy.hp}</span></span>}
          {enemy.sp && <span>SP <span className="text-white">{enemy.sp}</span></span>}
          {enemy.floor && <span className="text-p4-yellow/80">{enemy.floor}</span>}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 max-w-lg">
        <AffinityBadge element="Phy" affinity={enemy.phy} />
        <AffinityBadge element="Fir" affinity={enemy.fir} />
        <AffinityBadge element="Ice" affinity={enemy.ice} />
        <AffinityBadge element="Elc" affinity={enemy.elc} />
        <AffinityBadge element="Wnd" affinity={enemy.wnd} />
        <AffinityBadge element="Lgt" affinity={enemy.lgt} />
        <AffinityBadge element="Drk" affinity={enemy.drk} />
      </div>
    </div>
  );
}
