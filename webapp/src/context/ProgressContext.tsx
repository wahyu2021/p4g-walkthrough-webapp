import { useState, useEffect, ReactNode, useContext } from 'react';
import { ProgressContext, ProgressContextType } from './ProgressContextInstance';

const STORAGE_KEY = 'p4g-walkthrough-progress';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedDays));
  }, [completedDays]);

  const toggleDay = (date: string) => {
    setCompletedDays((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const isDayCompleted = (date: string) => !!completedDays[date];

  const resetProgress = () => {
    if (window.confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan.')) {
      setCompletedDays({});
    }
  };

  return (
    <ProgressContext.Provider value={{ completedDays, toggleDay, isDayCompleted, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};
