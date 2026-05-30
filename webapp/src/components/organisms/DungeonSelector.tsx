import { useRef } from 'react';
import { NavLink } from 'react-router-dom';

interface DungeonSelectorProps {
  dungeons: { id: string; name: string; order: number }[];
}

export function DungeonSelector({ dungeons }: DungeonSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Only apply horizontal scroll logic on mobile/small screens where layout is flex-row
    if (scrollContainerRef.current && window.innerWidth < 768) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      onWheel={handleWheel}
      className="w-full md:h-full overflow-x-auto md:overflow-x-hidden md:overflow-y-auto py-6 px-4 no-scrollbar"
    >
      <div className="flex flex-row md:flex-col space-x-6 md:space-x-0 md:space-y-4 w-max md:w-full mx-auto md:mx-0">
        {dungeons.map((d) => (
          <NavLink 
            key={d.id} 
            to={`/dungeons/${d.id}`}
            className={({ isActive }) => `
              block md:w-full md:px-2 transition-all
              ${isActive ? 'active-dungeon' : ''}
            `}
          >
            {({ isActive }) => (
              <div
                className={`
                  w-full px-4 py-3 font-bold text-sm md:text-sm border-2 border-p4-black transition-all
                  ${isActive 
                    ? 'bg-p4-yellow text-p4-black shadow-none translate-y-1' 
                    : 'bg-[#222] text-gray-400 shadow-[4px_4px_0px_0px_#111111] hover:-translate-y-0.5 hover:bg-[#444] hover:text-p4-yellow'}
                `}
                style={{
                  transform: isActive ? 'skewX(-5deg)' : 'skewX(-5deg) translateY(-2px)',
                }}
              >
                <div style={{ transform: 'skewX(5deg)' }} className="flex items-start space-x-2">
                  <span className="opacity-50 text-[10px] mt-1 shrink-0">#{d.order}</span>
                  <span className="leading-tight">{d.name}</span>
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
