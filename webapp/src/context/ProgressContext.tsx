import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ProgressContext } from './ProgressContextInstance';
import type { SocialStats } from './ProgressContextInstance';

const STORAGE_KEY = 'p4g-walkthrough-progress';
const STATS_STORAGE_KEY = 'p4g-walkthrough-stats';

const DEFAULT_STATS: SocialStats = {
  knowledge: 1,
  courage: 1,
  diligence: 1,
  understanding: 1,
  expression: 1
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [socialStats, setSocialStats] = useState<SocialStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(socialStats));
  }, [socialStats]);

  const toggleDay = (date: string) => {
    setCompletedDays((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const updateStat = (stat: keyof SocialStats, level: number) => {
    setSocialStats(prev => ({
      ...prev,
      [stat]: level
    }));
  };

  const isDayCompleted = (date: string) => !!completedDays[date];

  const resetProgress = () => {
    if (window.confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan.')) {
      setCompletedDays({});
      setSocialStats(DEFAULT_STATS);
    }
  };

  return (
    <ProgressContext.Provider value={{ completedDays, toggleDay, isDayCompleted, socialStats, updateStat, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}
