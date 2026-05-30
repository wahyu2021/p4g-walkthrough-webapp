import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ProgressContext } from './ProgressContextInstance';
import type { SocialStats } from './ProgressContextInstance';

const STORAGE_KEY = 'p4g-walkthrough-progress';
const STATS_STORAGE_KEY = 'p4g-walkthrough-stats';
const QUESTS_STORAGE_KEY = 'p4g-walkthrough-quests';
const BOOKS_STORAGE_KEY = 'p4g-walkthrough-books';

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

  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(QUESTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [completedBooks, setCompletedBooks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(BOOKS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(socialStats));
  }, [socialStats]);

  useEffect(() => {
    localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify(completedQuests));
  }, [completedQuests]);

  useEffect(() => {
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(completedBooks));
  }, [completedBooks]);

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

  const toggleQuest = (questId: string) => {
    setCompletedQuests((prev) => ({
      ...prev,
      [questId]: !prev[questId],
    }));
  };

  const isQuestCompleted = (questId: string) => !!completedQuests[questId];

  const toggleBook = (bookId: string) => {
    setCompletedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const isBookCompleted = (bookId: string) => !!completedBooks[bookId];

  const resetProgress = () => {
    if (window.confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan.')) {
      setCompletedDays({});
      setSocialStats(DEFAULT_STATS);
      setCompletedQuests({});
      setCompletedBooks({});
    }
  };

  return (
    <ProgressContext.Provider value={{ 
      completedDays, toggleDay, isDayCompleted, 
      socialStats, updateStat, 
      completedQuests, toggleQuest, isQuestCompleted,
      completedBooks, toggleBook, isBookCompleted,
      resetProgress 
    }}>
      {children}
    </ProgressContext.Provider>
  );
}
