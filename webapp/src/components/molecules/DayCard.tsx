import type { Day } from '../../types/walkthrough';
import { ActivityEntry } from '../atoms/ActivityEntry';

interface DayCardProps {
  day: Day;
  isCompleted: boolean;
  onToggle: () => void;
}

export function DayCard({    day, isCompleted, onToggle }: DayCardProps) {
  return (
    <div 
      className={`
        relative transition-all duration-300 group
        ${isCompleted ? 'opacity-60 grayscale-[0.3]' : ''}
      `}
      style={{
        clipPath: 'polygon(1% 0%, 100% 0%, 99% 100%, 0% 100%)'
      }}
    >
      {/* Background & Border Layer */}
      <div 
        className={`
          absolute inset-0 -z-10 border-2 transition-all duration-300
          ${isCompleted 
            ? 'bg-p4-black border-p4-gray' 
            : 'bg-[#2a2a2a] border-p4-black shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]'}
        `}
      />

      {/* Content Container */}
      <div className="relative z-10 border-2 border-transparent">
        {/* Header Bagian Atas (STICKY) */}
        <div 
          className={`
            p-4 flex justify-between items-center sticky top-[60px] z-30 backdrop-blur-md
            ${isCompleted ? 'bg-p4-gray/90' : 'bg-p4-black/90 border-b border-p4-yellow/20'}
          `}
        >
          <div className="flex items-baseline">
            <span className="text-p4-yellow font-black text-3xl italic tracking-tighter" style={{ textShadow: '2px 2px 0px #000' }}>
              {day.date}
            </span>
            <span className="ml-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
              {day.date_label?.split('~')[1]?.trim() || ''}
            </span>
          </div>

          <button
            onClick={onToggle}
            className={`
              px-6 py-1 text-xs font-black uppercase tracking-widest transition-all border-2
              ${isCompleted 
                ? 'bg-p4-gray text-gray-400 border-gray-500' 
                : 'bg-p4-yellow text-p4-black border-p4-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'}
            `}
          >
            {isCompleted ? 'CLEARED' : 'COMPLETE'}
          </button>
        </div>

        {/* List Entry Aktivitas */}
        <div className="p-4 space-y-4">
          {day.entries.map((entry, idx) => (
            <ActivityEntry key={idx} entry={entry} />
          ))}
        </div>
      </div>

      {/* Overlay if Completed */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
           <div className="border-8 border-p4-yellow text-p4-yellow px-10 py-4 text-6xl font-black uppercase italic rotate-12 opacity-30 tracking-[0.3em] select-none">
             CLEARED
           </div>
        </div>
      )}
    </div>
  );
}
