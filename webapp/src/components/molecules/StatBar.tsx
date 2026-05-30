import { useProgress } from '../../hooks/useProgress';
import type { SocialStats } from '../../context/ProgressContextInstance';

interface StatBarProps {
  statName: keyof SocialStats;
  displayName: string;
  colorClass: string;
}

export function StatBar({ statName, displayName, colorClass }: StatBarProps) {
  const { socialStats, updateStat } = useProgress();
  const currentLevel = socialStats[statName];

  return (
    <div className="flex flex-col mb-6">
      <div className="flex justify-between items-end mb-2">
        <h4 className="text-white font-black uppercase tracking-tighter text-xl flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
          {displayName}
        </h4>
        <span className="text-gray-500 font-black italic text-xs">LV. {currentLevel}</span>
      </div>
      
      <div className="flex space-x-1 sm:space-x-2">
        {[1, 2, 3, 4, 5].map((level) => {
          const isActive = level <= currentLevel;
          const isCurrent = level === currentLevel;
          
          return (
            <button
              key={level}
              onClick={() => updateStat(statName, level)}
              className={`
                flex-1 h-10 sm:h-12 border-2 transition-all skew-x-[-10deg]
                ${isActive 
                  ? `${colorClass} border-transparent shadow-[2px_2px_0px_0px_#111]` 
                  : 'bg-p4-black border-[#333] hover:border-gray-500'}
                ${isCurrent ? 'scale-y-110 z-10 brightness-110' : 'opacity-80 hover:opacity-100'}
              `}
              title={`Set ${displayName} to Level ${level}`}
            />
          );
        })}
      </div>
    </div>
  );
}
