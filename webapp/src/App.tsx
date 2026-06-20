import { useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AlertTriangle, Info } from 'lucide-react';
import { MainLayout } from './components/templates/MainLayout';
import { MonthSelector } from './components/organisms/MonthSelector';
import { DungeonSelector } from './components/organisms/DungeonSelector';
import { TodaysSchedule } from './components/organisms/TodaysSchedule';
import { ScrollToTop } from './components/atoms/ScrollToTop';
import { NavTabs } from './components/molecules/NavTabs';
import { getAvailableMonths, getWalkthroughData, getDungeons } from './utils/dataFetcher';
import { useProgress } from './hooks/useProgress';
import type { WalkthroughMonth, Dungeon } from './types/walkthrough';
import { LoginScreen } from './components/organisms/LoginScreen';
import { AdminPanel } from './pages/AdminPanel';

// Lazy load pages for code splitting
const WalkthroughView = lazy(() => import('./components/templates/WalkthroughView').then(module => ({ default: module.WalkthroughView })));
const SocialLinksPage = lazy(() => import('./pages/SocialLinksPage').then(module => ({ default: module.SocialLinksPage })));
const DungeonsPage = lazy(() => import('./pages/DungeonsPage').then(module => ({ default: module.DungeonsPage })));
const ExamsPage = lazy(() => import('./pages/ExamsPage').then(module => ({ default: module.ExamsPage })));
const TrackerPage = lazy(() => import('./pages/TrackerPage').then(module => ({ default: module.TrackerPage })));
const VelvetRoomPage = lazy(() => import('./pages/VelvetRoomPage').then(module => ({ default: module.VelvetRoomPage })));

function AppContent() {
  const location = useLocation();
  const { userId, role, logout, completedDays, resetProgress } = useProgress();

  const [availableMonths, setAvailableMonths] = useState<{ month: string; month_num: number }[]>([]);
  const [allData, setAllData] = useState<WalkthroughMonth[]>([]);
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAvailableMonths(),
      getWalkthroughData(),
      getDungeons()
    ]).then(([months, data, dungs]) => {
      setAvailableMonths(months);
      setAllData(data);
      setDungeons(dungs);
      setIsLoading(false);
    });
  }, []);

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

  const isWalkthroughRoute = location.pathname === '/' || location.pathname.startsWith('/walkthrough');
  const isDungeonsRoute = location.pathname.startsWith('/dungeons');

  if (!userId) {
    return <LoginScreen />;
  }

  if (location.pathname === '/admin') {
    return <AdminPanel />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-p4-black text-p4-yellow font-bold uppercase tracking-widest animate-pulse">
        Loading Data...
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col py-6 space-y-8">
      {/* User Profile Section */}
      <section className="px-6 flex flex-col gap-2">
         <div className="text-[10px] text-gray-500 font-black tracking-widest uppercase">Current Data</div>
         <div className="flex justify-between items-center bg-p4-gray border border-p4-yellow px-4 py-2 skew-x-[-5deg]">
           <span className="text-white font-black">{userId}</span>
           <div className="flex gap-4">
             {role === 'admin' && (
               <Link to="/admin" className="text-[10px] text-p4-yellow hover:text-white uppercase font-bold tracking-widest">
                 Admin
               </Link>
             )}
             <button 
               onClick={logout}
               className="text-[10px] text-p4-yellow hover:text-white uppercase font-bold tracking-widest"
             >
               Logout
             </button>
           </div>
         </div>
      </section>

      {/* Main Menu Section */}
      <section>
        <h3 className="px-6 mb-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
          Main Menu
        </h3>
        <div className="md:px-2">
          <NavTabs 
            isVertical={true} 
          />
        </div>
      </section>

      {/* Today's Schedule Widget (Global) */}
      <section className="px-2">
        <TodaysSchedule />
      </section>

      {/* Timeline Section (Only for Walkthrough) */}
      {isWalkthroughRoute && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h3 className="px-6 mb-4 text-[10px] font-black text-p4-yellow uppercase tracking-[0.3em]">
            Timeline
          </h3>
          <MonthSelector 
            months={availableMonths} 
          />
        </section>
      )}

      {/* Dungeons Section (Only for Dungeons route) */}
      {isDungeonsRoute && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h3 className="px-6 mb-4 text-[10px] font-black text-p4-yellow uppercase tracking-[0.3em]">
            Locations
          </h3>
          <DungeonSelector 
            dungeons={dungeons} 
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
      <Suspense fallback={
        <div className="flex items-center justify-center h-64 text-p4-yellow font-bold uppercase tracking-widest animate-pulse">
          Loading Data...
        </div>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/walkthrough/april" replace />} />
          <Route path="/walkthrough" element={<Navigate to="/walkthrough/april" replace />} />
          <Route path="/walkthrough/:monthSlug" element={<WalkthroughView />} />
          
          <Route path="/social-links" element={<SocialLinksPage />} />
          <Route path="/dungeons" element={<DungeonsPage />} />
          <Route path="/dungeons/:slug" element={<DungeonsPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/velvet-room" element={<VelvetRoomPage />} />
        </Routes>
      </Suspense>

      <ScrollToTop />
    </MainLayout>
  );
}

function App() {
  const [announcement, setAnnouncement] = useState<{message: string, type: string, isActive: boolean} | null>(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
    fetch(`${API_BASE_URL}/announcement`)
      .then(r => r.json())
      .then(d => {
        if (d && d.isActive) setAnnouncement(d);
      }).catch(e => console.error(e));
  }, []);

  return (
    <>
      {announcement && announcement.isActive && (
        <div className={`w-full p-2 text-center text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse z-50 relative ${announcement.type === 'warning' ? 'bg-red-600 text-white' : 'bg-p4-yellow text-p4-black'}`}>
          {announcement.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          {announcement.message}
        </div>
      )}
      <AppContent />
    </>
  );
}

export default App;
