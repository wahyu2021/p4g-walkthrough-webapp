import { useState, useMemo } from 'react';
import { MainLayout } from './components/templates/MainLayout';
import { MonthSelector } from './components/organisms/MonthSelector';
import { DayList } from './components/organisms/DayList';
import { SearchInput } from './components/atoms/SearchInput';
import { ScrollToTop } from './components/atoms/ScrollToTop';
import { getAvailableMonths, getWalkthroughData } from './utils/dataFetcher';
import { useProgress } from './hooks/useProgress';

function App() {
  const availableMonths = getAvailableMonths();
  const allData = getWalkthroughData();
  const { completedDays, resetProgress } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');

  // Default to the first month in the data (April)
  const [activeMonth, setActiveMonth] = useState<string>(
    availableMonths.length > 0 ? availableMonths[0].month : ''
  );

  // Filter days for the active month
  const activeMonthData = useMemo(() => {
    const foundMonth = allData.find(m => m.month === activeMonth);
    return foundMonth ? foundMonth.days : [];
  }, [allData, activeMonth]);

  // Calculate overall progress
  const totalDays = useMemo(() => {
    return allData.reduce((acc, m) => acc + m.days.length, 0);
  }, [allData]);

  const completedCount = useMemo(() => {
    return Object.values(completedDays).filter(Boolean).length;
  }, [completedDays]);

  const progressPercentage = Math.round((completedCount / totalDays) * 100) || 0;

  return (
    <MainLayout 
      headerContent={
        <div className="flex items-center space-x-4">
           <div className="hidden md:flex flex-col items-end">
             <div className="text-[10px] uppercase font-black text-p4-yellow tracking-tighter">Overall Progress</div>
             <div className="w-32 h-2 bg-p4-gray rounded-full overflow-hidden border border-p4-black">
               <div 
                 className="h-full bg-p4-yellow transition-all duration-500" 
                 style={{ width: `${progressPercentage}%` }}
               />
             </div>
           </div>
           <div className="bg-p4-yellow text-p4-black px-2 py-0.5 font-black italic text-sm skew-x-[-10deg]">
             {progressPercentage}%
           </div>
           <button 
             onClick={resetProgress}
             className="text-[10px] text-gray-500 hover:text-red-500 transition-colors uppercase font-bold"
           >
             Reset
           </button>
        </div>
      }
      sidebar={
        <MonthSelector 
          months={availableMonths} 
          activeMonth={activeMonth} 
          onMonthSelect={(m) => {
            setActiveMonth(m);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      }
    >
      <div className="flex flex-col space-y-6">
        <div className="px-0">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        
        <div className="pb-10" key={activeMonth}>
          <DayList days={activeMonthData} searchQuery={searchQuery} />
        </div>
      </div>
      <ScrollToTop />
    </MainLayout>
  );
}

export default App;
