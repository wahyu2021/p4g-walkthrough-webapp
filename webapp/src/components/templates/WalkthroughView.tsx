import { useState, useMemo, useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { DayList } from '../organisms/DayList';
import { SearchInput } from '../atoms/SearchInput';
import { getWalkthroughData } from '../../utils/dataFetcher';
import type { WalkthroughMonth } from '../../types/walkthrough';

export function WalkthroughView() {
  const { monthSlug } = useParams<{ monthSlug: string }>();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allData, setAllData] = useState<WalkthroughMonth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWalkthroughData().then(data => {
      setAllData(data);
      setIsLoading(false);
    });
  }, []);

  // Filter days for the active month
  const activeMonthData = useMemo(() => {
    if (!monthSlug || allData.length === 0) return [];
    const foundMonth = allData.find(m => m.month === monthSlug.toLowerCase());
    return foundMonth ? foundMonth.days : [];
  }, [allData, monthSlug]);

  useEffect(() => {
    if (!isLoading && location.hash && activeMonthData.length > 0) {
      // Small timeout to ensure DOM is updated after render
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [isLoading, location.hash, location.key, activeMonthData]);

  if (!monthSlug) {
    return <Navigate to="/walkthrough/april" replace />;
  }

  if (isLoading) {
    return <div className="text-p4-yellow p-6 font-bold uppercase animate-pulse">Loading Walkthrough Data...</div>;
  }

  // If the user manually types an invalid month, redirect to april
  if (activeMonthData.length === 0 && allData.length > 0) {
    return <Navigate to="/walkthrough/april" replace />;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="px-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      
      <div className="pb-10" key={monthSlug}>
        <DayList days={activeMonthData} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
