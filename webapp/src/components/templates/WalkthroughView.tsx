import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DayList } from '../organisms/DayList';
import { SearchInput } from '../atoms/SearchInput';
import { getWalkthroughData } from '../../utils/dataFetcher';

export function WalkthroughView() {
  const { monthSlug } = useParams<{ monthSlug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const allData = useMemo(() => getWalkthroughData(), []);

  // Filter days for the active month
  const activeMonthData = useMemo(() => {
    if (!monthSlug) return [];
    const foundMonth = allData.find(m => m.month === monthSlug.toLowerCase());
    return foundMonth ? foundMonth.days : [];
  }, [allData, monthSlug]);

  if (!monthSlug) {
    return <Navigate to="/walkthrough/april" replace />;
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
