import walkthroughData from '../data/walkthrough.json';
import socialLinksData from '../data/social_links.json';
import dungeonsData from '../data/dungeons.json';
import type { WalkthroughMonth, SocialLink, Dungeon } from '../types/walkthrough';

export const getWalkthroughData = (): WalkthroughMonth[] => {
  return walkthroughData as WalkthroughMonth[];
};

export const getAvailableMonths = (): { month: string; month_num: number }[] => {
  return (walkthroughData as WalkthroughMonth[]).map(m => ({
    month: m.month,
    month_num: m.month_num
  }));
};

export const getSocialLinks = (): SocialLink[] => {
  return socialLinksData as SocialLink[];
};

export const getDungeons = (): Dungeon[] => {
  return dungeonsData as Dungeon[];
};
