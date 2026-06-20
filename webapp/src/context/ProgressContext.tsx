import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ProgressContext } from './ProgressContextInstance';
import type { SocialStats } from './ProgressContextInstance';

const USER_STORAGE_KEY = 'p4g-walkthrough-userid';
// Gunakan URL API spesifik jika sedang di lokal, atau relative path '/api' saat di production (melalui Nginx Reverse Proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const DEFAULT_STATS: SocialStats = {
  knowledge: 1,
  courage: 1,
  diligence: 1,
  understanding: 1,
  expression: 1
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem(USER_STORAGE_KEY));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('p4g-auth-token'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('p4g-user-role'));
  const [dataLoaded, setDataLoaded] = useState(false);

  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
  const [socialStats, setSocialStats] = useState<SocialStats>(DEFAULT_STATS);
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const [completedBooks, setCompletedBooks] = useState<Record<string, boolean>>({});

  // 1. Fetch data when userId changes (Login/Init)
  useEffect(() => {
    if (!userId) {
      setDataLoaded(false);
      setCompletedDays({});
      setSocialStats(DEFAULT_STATS);
      setCompletedQuests({});
      setCompletedBooks({});
      return;
    }

    let isMounted = true;
    const fetchProgress = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/progress/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch progress');
        
        const data = await response.json();
        if (isMounted && data) {
          setCompletedDays(data.completedDays || {});
          setSocialStats(data.socialStats || DEFAULT_STATS);
          setCompletedQuests(data.completedQuests || {});
          setCompletedBooks(data.completedBooks || {});
          setDataLoaded(true); // Flag that DB data has populated UI
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        // Even if error, we allow them to proceed with empty state to not block the app
        if (isMounted) setDataLoaded(true); 
      }
    };

    fetchProgress();
    return () => { isMounted = false; };
  }, [userId]);

  // 2. Auto-save to MongoDB when data changes (only if dataLoaded is true to prevent overwriting DB with empty init state)
  useEffect(() => {
    if (!userId || !dataLoaded) return;

    const saveProgress = async () => {
      try {
        await fetch(`${API_BASE_URL}/progress/${userId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            completedDays,
            socialStats,
            completedQuests,
            completedBooks
          })
        });
      } catch (error) {
        console.error('Failed to sync progress:', error);
      }
    };

    // Simple debounce to avoid spamming the API on rapid clicks
    const timeoutId = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeoutId);
  }, [completedDays, socialStats, completedQuests, completedBooks, userId, dataLoaded]);


  const login = (id: string, newToken: string, userRole: string) => {
    localStorage.setItem(USER_STORAGE_KEY, id);
    localStorage.setItem('p4g-auth-token', newToken);
    localStorage.setItem('p4g-user-role', userRole);
    setUserId(id);
    setToken(newToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('p4g-auth-token');
    localStorage.removeItem('p4g-user-role');
    setUserId(null);
    setToken(null);
    setRole(null);
  };

  const toggleDay = (date: string) => {
    setCompletedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const updateStat = (stat: keyof SocialStats, level: number) => {
    setSocialStats(prev => ({ ...prev, [stat]: level }));
  };

  const isDayCompleted = (date: string) => !!completedDays[date];

  const toggleQuest = (questId: string) => {
    setCompletedQuests((prev) => ({ ...prev, [questId]: !prev[questId] }));
  };

  const isQuestCompleted = (questId: string) => !!completedQuests[questId];

  const toggleBook = (bookId: string) => {
    setCompletedBooks((prev) => ({ ...prev, [bookId]: !prev[bookId] }));
  };

  const isBookCompleted = (bookId: string) => !!completedBooks[bookId];

  const resetProgress = () => {
    if (window.confirm('Hapus semua progres? Tindakan ini tidak bisa dibatalkan dan akan terhapus dari Database.')) {
      setCompletedDays({});
      setSocialStats(DEFAULT_STATS);
      setCompletedQuests({});
      setCompletedBooks({});
    }
  };

  return (
    <ProgressContext.Provider value={{ 
      userId, token, role, login, logout,
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
