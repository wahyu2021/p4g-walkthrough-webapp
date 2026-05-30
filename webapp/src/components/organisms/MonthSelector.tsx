import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { MonthTab } from '../molecules/MonthTab';

interface MonthSelectorProps {
  months: { month: string; month_num: number }[];
}

export function MonthSelector({ months }: MonthSelectorProps) {
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
        {months.map((m) => (
          <NavLink 
            key={m.month} 
            to={`/walkthrough/${m.month}`}
            className={({ isActive }) => `block md:w-full md:px-2 ${isActive ? 'active-month' : ''}`}
          >
            {({ isActive }) => (
              <MonthTab
                monthName={m.month}
                isActive={isActive}
              />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
