import React from 'react';

interface AffinityBadgeProps {
  element: string; // 'Phy', 'Fir', 'Ice', 'Elc', 'Wnd', 'Lgt', 'Drk'
  affinity: string; // 'Weak', 'Resist', 'Null', 'Drain', 'Repel', '-'
}

export function AffinityBadge({ element, affinity }: AffinityBadgeProps) {
  let bgColor = 'bg-[#151515]';
  let textColor = 'text-gray-600';
  let border = 'border-[#2a2a2a]';

  if (affinity === 'Weak') {
    bgColor = 'bg-red-900/40';
    textColor = 'text-red-400';
    border = 'border-red-500/50';
  } else if (affinity === 'Resist') {
    bgColor = 'bg-blue-900/40';
    textColor = 'text-blue-300';
    border = 'border-blue-500/50';
  } else if (affinity === 'Null') {
    bgColor = 'bg-gray-800/60';
    textColor = 'text-gray-300';
    border = 'border-gray-500/50';
  } else if (affinity === 'Drain') {
    bgColor = 'bg-green-900/40';
    textColor = 'text-green-400';
    border = 'border-green-500/50';
  } else if (affinity === 'Repel') {
    bgColor = 'bg-cyan-900/40';
    textColor = 'text-cyan-400';
    border = 'border-cyan-500/50';
  }

  const shortAffinity = affinity === 'Weak' ? 'WK' : 
                        affinity === 'Resist' ? 'RS' : 
                        affinity === 'Null' ? 'NU' : 
                        affinity === 'Drain' ? 'DR' : 
                        affinity === 'Repel' ? 'RP' : '-';

  return (
    <div className={`flex flex-col items-center justify-center aspect-square w-full min-h-[40px] max-h-[56px] border ${border} ${bgColor} text-xs shrink-0`}>
      <span className="text-[8px] sm:text-[9px] uppercase font-black text-white/40 tracking-tighter leading-none mb-1">{element}</span>
      <span className={`text-[11px] sm:text-xs font-black uppercase tracking-tighter leading-none ${textColor}`}>{shortAffinity}</span>
    </div>
  );
}
