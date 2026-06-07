import { useState, useEffect } from 'react';
import { useProgress } from './useProgress';
import { getWalkthroughData } from '../utils/dataFetcher';
import type { Day, WalkthroughMonth } from '../types/walkthrough';

export function useNextDay(): { nextDay: Day | null; monthSlug: string; isLoading: boolean } {
  const { completedDays } = useProgress();
  const [allData, setAllData] = useState<WalkthroughMonth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWalkthroughData().then(data => {
      setAllData(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return { nextDay: null, monthSlug: '', isLoading: true };
  }

  for (const month of allData) {
    for (const day of month.days) {
      // The toggle logic uses day.date as the key
      if (!completedDays[day.date]) {
        return { nextDay: day, monthSlug: month.month, isLoading: false };
      }
    }
  }
  return { nextDay: null, monthSlug: '', isLoading: false };
}
