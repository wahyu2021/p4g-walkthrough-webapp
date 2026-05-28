import { useMemo } from 'react';
import type { Day } from '../../types/walkthrough';
import { DayCard } from '../molecules/DayCard';
import { useProgress } from '../../hooks/useProgress';

interface DayListProps {
  days: Day[];
  searchQuery?: string;
}

export function DayList({ days, searchQuery = '' }: DayListProps) {
  const { isDayCompleted, toggleDay } = useProgress();

  const filteredDays = useMemo(() => {
    if (!searchQuery.trim()) return days;

    const query = searchQuery.toLowerCase();
    
    return days.map(day => {
      const filteredEntries = day.entries.filter(entry => 
        entry.title.toLowerCase().includes(query) || 
        entry.content.toLowerCase().includes(query)
      );

      return {
        ...day,
        entries: filteredEntries
      };
    }).filter(day => day.entries.length > 0);
  }, [days, searchQuery]);

  if (filteredDays.length === 0) {
    return (
      <div className="bg-p4-black border-2 border-p4-gray p-12 text-center animate-in fade-in duration-500">
        <p className="text-gray-500 italic uppercase font-bold tracking-widest">
          {searchQuery ? `No results found for "${searchQuery}"` : 'No data available for this period.'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {filteredDays.map((day) => (
        <DayCard
          key={day.date}
          day={day}
          isCompleted={isDayCompleted(day.date)}
          onToggle={() => toggleDay(day.date)}
        />
      ))}
    </div>
  );
}
