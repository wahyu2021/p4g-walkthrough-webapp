import { useState, useMemo } from 'react';
import { MainLayout } from './components/templates/MainLayout';
import { MonthSelector } from './components/organisms/MonthSelector';
import { DayList } from './components/organisms/DayList';
import { SearchInput } from './components/atoms/SearchInput';
import { ScrollToTop } from './components/atoms/ScrollToTop';
import { NavTabs } from './components/molecules/NavTabs';
import { SocialLinksPage } from './pages/SocialLinksPage';
import { DungeonsPage } from './pages/DungeonsPage';
import { ExamsPage } from './pages/ExamsPage';
import { getAvailableMonths, getWalkthroughData } from './utils/dataFetcher';
import { useProgress } from './hooks/useProgress';

function App() {
  const [currentView, setCurrentView] = useState('walkthrough');
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
    // We only count keys that are explicitly set to TRUE
    return Object.keys(completedDays).filter(key => completedDays[key] === true).length;
  }, [completedDays]);

  const progressPercentage = useMemo(() => {
    if (totalDays === 0) return "0.00";
    return ((completedCount / totalDays) * 100).toFixed(2);
  }, [completedCount, totalDays]);

  const sidebarContent = (
    <div className="flex flex-col py-6 space-y-8">
      {/* Main Menu Section */}
      <section>
        <h3 className="px-6 mb-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Main Menu
        </h3>
        <div className="md:px-2">
          <NavTabs 
            currentView={currentView} 
            onViewChange={setCurrentView} 
            isVertical={true} 
          />
        </div>
      </section>

      {/* Timeline Section (Only for Walkthrough) */}
      {currentView === 'walkthrough' && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h3 className="px-6 mb-4 text-[10px] font-black text-p4-yellow uppercase tracking-[0.3em]">
            Timeline
          </h3>
          <MonthSelector 
            months={availableMonths} 
            activeMonth={activeMonth} 
            onMonthSelect={(m) => {
              setActiveMonth(m);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        </section>
      )}
    </div>
  );

  return (
    <MainLayout 
      headerContent={
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-4">
             <div className="flex flex-col items-end">
               <div className="text-[10px] uppercase font-black text-p4-yellow tracking-tighter leading-none mb-1">Overall Progress</div>
               <div className="w-24 h-1.5 bg-p4-gray rounded-full overflow-hidden border border-p4-black">
                 <div 
                   className="h-full bg-p4-yellow transition-all duration-500" 
                   style={{ width: `${progressPercentage}%` }}
                 />
               </div>
             </div>
             <div className="bg-p4-yellow text-p4-black px-2 py-0.5 font-black italic text-sm skew-x-[-10deg] min-w-15 text-center">
               {progressPercentage}%
             </div>
           </div>
           
           <div className="border-l border-p4-gray/30 pl-6 hidden sm:block">
             <button 
                onClick={resetProgress}
                className="text-[10px] text-gray-500 hover:text-red-500 transition-colors uppercase font-black tracking-widest border border-p4-gray/30 px-2 py-1 hover:border-red-500/50 bg-p4-black/20"
              >
                Reset
              </button>
           </div>
        </div>
      }
      sidebar={sidebarContent}
    >
      {currentView === 'walkthrough' && (
        <div className="flex flex-col space-y-6">
          <div className="px-4">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="pb-10" key={activeMonth}>
            <DayList days={activeMonthData} searchQuery={searchQuery} />
          </div>
        </div>
      )}

      {currentView === 'social' && (
        <SocialLinksPage />
      )}

      {currentView === 'dungeons' && (
        <DungeonsPage />
      )}

      {currentView === 'exams' && (
        <ExamsPage />
      )}

      <ScrollToTop />
    </MainLayout>
  );
}

export default App;
