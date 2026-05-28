import { createContext } from 'react';

export interface ProgressContextType {
  completedDays: Record<string, boolean>;
  toggleDay: (date: string) => void;
  isDayCompleted: (date: string) => boolean;
  resetProgress: () => void;
}

export const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
