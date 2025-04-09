
export type Lyric = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  userId: string; // Added to track which user created the lyric
  authorDisplayName?: string; // Optional display name
};

const STORAGE_KEY = 'lyric-locker';
const SITE_PASSWORD = 'music123'; // This would be better stored securely in a real app
const PASSWORD_VERIFIED_KEY = 'lyric-password-verified';

export const validatePassword = (password: string): boolean => {
  const isValid = password === SITE_PASSWORD;
  if (isValid) {
    localStorage.setItem(PASSWORD_VERIFIED_KEY, 'true');
  }
  return isValid;
};

export const isPasswordVerified = (): boolean => {
  return localStorage.getItem(PASSWORD_VERIFIED_KEY) === 'true';
};

export const getLyrics = (): Lyric[] => {
  const lyricsJson = localStorage.getItem(STORAGE_KEY);
  if (!lyricsJson) return [];
  
  try {
    return JSON.parse(lyricsJson);
  } catch (error) {
    console.error('Failed to parse lyrics from localStorage', error);
    return [];
  }
};

export const addLyric = (lyric: Omit<Lyric, 'id' | 'createdAt'>, userId: string): Lyric => {
  const lyrics = getLyrics();
  
  const newLyric: Lyric = {
    ...lyric,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    userId,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newLyric, ...lyrics]));
  
  return newLyric;
};

export const deleteLyric = (id: string): boolean => {
  const lyrics = getLyrics();
  const updatedLyrics = lyrics.filter(lyric => lyric.id !== id);
  
  if (updatedLyrics.length === lyrics.length) {
    return false; // Lyric not found
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLyrics));
  return true;
};
