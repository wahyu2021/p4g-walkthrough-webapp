import type { WalkthroughMonth, SocialLink, Dungeon } from '../types/walkthrough';

const API_BASE_URL = 'http://localhost:5000/api';

export const getWalkthroughData = async (): Promise<WalkthroughMonth[]> => {
  const response = await fetch(`${API_BASE_URL}/walkthrough`);
  if (!response.ok) return [];
  // Data walkthrough di mongo saat ini mungkin berbentuk object (karena seed file JSON aslinya),
  // jadi kita perlu pastikan bentuknya array, atau menyesuaikan berdasarkan responnya.
  // Untuk amannya, kita asumsikan JSON asli array dari objects atau kita load ulang strukturnya:
  const data = await response.json();
  // Tangani kasus jika data adalah object kosong atau document terbungkus
  if (Array.isArray(data)) return data;
  if (data && data.months) return data.months;
  
  // Jika masih butuh file lokal sebagai fallback (opsional) saat API mati, bisa di-import tapi disarankan murni API:
  return [];
};

export const getAvailableMonths = async (): Promise<{ month: string; month_num: number }[]> => {
  const walkthroughData = await getWalkthroughData();
  return walkthroughData.map(m => ({
    month: m.month,
    month_num: m.month_num
  }));
};

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const response = await fetch(`${API_BASE_URL}/social_links`);
  if (!response.ok) return [];
  return await response.json();
};

export const getDungeons = async (): Promise<Dungeon[]> => {
  const response = await fetch(`${API_BASE_URL}/dungeons`);
  if (!response.ok) return [];
  return await response.json();
};

