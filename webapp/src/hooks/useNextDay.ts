import { useProgress } from './useProgress';
import { getWalkthroughData } from '../utils/dataFetcher';
import type { Day } from '../types/walkthrough';

export function useNextDay(): { nextDay: Day | null; monthSlug: string } {
  const { completedDays } = useProgress();
  const allData = getWalkthroughData();

  for (const month of allData) {
    for (const day of month.days) {
      // The toggle logic uses day.date as the key
      if (!completedDays[day.date]) {
        return { nextDay: day, monthSlug: month.month };
      }
    }
  }
  return { nextDay: null, monthSlug: '' };
}
