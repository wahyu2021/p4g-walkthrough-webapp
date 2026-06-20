import { createContext } from 'react';

export type SocialStats = {
  knowledge: number;
  courage: number;
  diligence: number;
  understanding: number;
  expression: number;
};

export interface ProgressContextType {
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
  completedDays: Record<string, boolean>;
  toggleDay: (date: string) => void;
  isDayCompleted: (date: string) => boolean;
  socialStats: SocialStats;
  updateStat: (stat: keyof SocialStats, level: number) => void;
  completedQuests: Record<string, boolean>;
  toggleQuest: (questId: string) => void;
  isQuestCompleted: (questId: string) => boolean;
  completedBooks: Record<string, boolean>;
  toggleBook: (bookId: string) => void;
  isBookCompleted: (bookId: string) => boolean;
  resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
