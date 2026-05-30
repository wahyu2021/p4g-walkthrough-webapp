import { NavLink } from 'react-router-dom';
import { useNextDay } from '../../hooks/useNextDay';

export function TodaysSchedule() {
  const { nextDay, monthSlug } = useNextDay();

  if (!nextDay) {
    return (
      <div className="bg-p4-black border-2 border-p4-yellow p-4 mb-4 relative overflow-hidden">
        {/* Decorative static */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />
        <h4 className="text-p4-yellow font-black uppercase tracking-widest text-xs relative z-10">Mission Complete</h4>
        <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest relative z-10">You have finished the walkthrough!</p>
      </div>
    );
  }

  // Summarize activities
  const summaryCount = nextDay.entries.length;
  const topEntries = nextDay.entries.slice(0, 3);
  const hasMore = summaryCount > 3;

  return (
    <div 
      className="bg-[#2a2a2a] border-l-4 border-p4-yellow p-4 mb-4 shadow-[4px_4px_0px_0px_#111111] relative overflow-hidden group"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 0% 100%)' }}
    >
      {/* Decorative static */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_4px,3px_100%]" />

      <h4 className="text-red-500 font-black italic uppercase tracking-tighter text-xs mb-1 relative z-10 flex items-center">
        <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
        Up Next
      </h4>
      
      <div className="text-2xl font-black text-white uppercase tracking-tight mb-3 relative z-10 leading-none">
        {nextDay.date}
      </div>

      <div className="space-y-1.5 mb-4 relative z-10">
        {topEntries.map((entry, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <span className="text-p4-yellow font-black text-[10px] mt-0.5 shrink-0">→</span>
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wide leading-tight line-clamp-2">
              {entry.type === 'Free Time' ? 'Free Time' : entry.title || entry.type}
            </span>
          </div>
        ))}
        {hasMore && (
          <div className="text-[10px] text-gray-500 font-black uppercase italic tracking-widest pl-4">
            + {summaryCount - 3} more activities...
          </div>
        )}
      </div>

      <NavLink 
        to={`/walkthrough/${monthSlug}`}
        className="block w-full text-center bg-p4-yellow text-p4-black px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-p4-black hover:bg-white transition-colors relative z-10 skew-x-[-5deg]"
      >
        <div style={{ transform: 'skewX(5deg)' }}>
          Go to Schedule
        </div>
      </NavLink>
    </div>
  );
}
