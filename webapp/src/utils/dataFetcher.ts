import walkthroughData from '../data/walkthrough.json';
import type { WalkthroughMonth } from '../types/walkthrough';

export const getWalkthroughData = (): WalkthroughMonth[] => {
  return walkthroughData as WalkthroughMonth[];
};

export const getAvailableMonths = (): { month: string; month_num: number }[] => {
  return (walkthroughData as WalkthroughMonth[]).map(m => ({
    month: m.month,
    month_num: m.month_num
  }));
};
