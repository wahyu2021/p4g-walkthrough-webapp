import { createContext } from 'react';

export type SocialStats = {
  knowledge: number;
  courage: number;
  diligence: number;
  understanding: number;
  expression: number;
};

export interface ProgressContextType {
  completedDays: Record<string, boolean>;
  toggleDay: (date: string) => void;
  isDayCompleted: (date: string) => boolean;
  socialStats: SocialStats;
  updateStat: (stat: keyof SocialStats, level: number) => void;
  resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
