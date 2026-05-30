import { useState, useMemo } from 'react';
import type { Dungeon } from '../../types/walkthrough';
import { EnemyRow } from '../molecules/EnemyRow';
import { BossRow } from '../molecules/BossRow';
import { SearchInput } from '../atoms/SearchInput';

interface DungeonDetailProps {
  dungeon: Dungeon;
}

export function DungeonDetail({ dungeon }: DungeonDetailProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Casting to avoid 'any' lint errors for unmapped properties
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

  const filteredEnemies = useMemo(() => {
    if (!dungeon.enemies) return [];
    if (!searchQuery) return dungeon.enemies;
    const q = searchQuery.toLowerCase();
    return dungeon.enemies.filter(e => 
      e.enemy.toLowerCase().includes(q) ||
      e.phy.toLowerCase().includes(q) ||
      e.fir.toLowerCase().includes(q) ||
      e.ice.toLowerCase().includes(q) ||
      e.elc.toLowerCase().includes(q) ||
      e.wnd.toLowerCase().includes(q) ||
      e.lgt.toLowerCase().includes(q) ||
      e.drk.toLowerCase().includes(q)
    );
  }, [dungeon.enemies, searchQuery]);

  return (
    <div 
      className="relative group bg-[#2a2a2a] border-2 border-p4-black p-5 transition-all shadow-[6px_6px_0px_0px_#111111] animate-in fade-in slide-in-from-bottom-4 duration-500"
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
      
      <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
        {dungeon.name}
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
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

        <div className="bg-p4-black/50 p-4 border border-p4-gray/30 flex items-center justify-center">
            <span className="text-lg text-gray-400 font-black uppercase tracking-widest">
              Floors: <span className="text-white">{dungeon.floors_count || '??'}</span>
            </span>
        </div>
      </div>

      <div className="mt-6 border-t-2 border-p4-gray border-dashed pt-8">
        
        {/* Bosses Section */}
        {(dungeon.bosses?.length > 0 || dungeon.mini_bosses?.length > 0) && (
          <div className="mb-10">
            <h4 className="text-red-500 font-black italic uppercase tracking-tighter text-2xl mb-6 flex items-center">
              <span className="mr-3">Target Shadows</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-red-600/50 to-transparent"></div>
            </h4>
            
            <div className="space-y-2">
              {dungeon.bosses?.map((b, i) => (
                <BossRow key={`boss-${i}`} boss={b} />
              ))}
              {dungeon.mini_bosses?.map((mb, i) => (
                <BossRow key={`mboss-${i}`} boss={mb} isMiniBoss />
              ))}
            </div>
            
            {dungeon.boss?.strategy && (
              <div className="mt-6 bg-red-950/20 border border-red-900/50 p-5 rounded-sm">
                <h5 className="text-[10px] text-red-400 uppercase font-black tracking-widest mb-3 flex items-center">
                  <span className="bg-red-900/50 px-2 py-1 mr-2">Navi Advice</span>
                  Intelligence
                </h5>
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{dungeon.boss.strategy}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bestiary Section */}
        {dungeon.enemies?.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h4 className="text-white font-black italic uppercase tracking-tighter text-2xl flex items-center mb-4 sm:mb-0">
                <span className="mr-3">Midnight Bestiary</span>
                <div className="hidden sm:block flex-1 h-0.5 bg-gradient-to-r from-p4-yellow/50 to-transparent"></div>
              </h4>
              
              <div className="w-full sm:w-1/2 md:w-1/3">
                <SearchInput 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search Weakness (e.g. 'Weak' or 'Wind')"
                />
              </div>
            </div>
            
            <div className="space-y-1 pr-2">
              {filteredEnemies.length > 0 ? (
                filteredEnemies.map((e, i) => (
                  <EnemyRow key={`enemy-${i}`} enemy={e} />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 uppercase font-bold text-sm bg-p4-black/30 border border-dashed border-gray-700">
                  No shadows match your analysis.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
