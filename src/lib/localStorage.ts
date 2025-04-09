
export type Lyric = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

const STORAGE_KEY = 'lyric-locker';
const SITE_PASSWORD = 'music123'; // This would be better stored securely in a real app

export const validatePassword = (password: string): boolean => {
  return password === SITE_PASSWORD;
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

export const addLyric = (lyric: Omit<Lyric, 'id' | 'createdAt'>): Lyric => {
  const lyrics = getLyrics();
  
  const newLyric: Lyric = {
    ...lyric,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newLyric, ...lyrics]));
  
  return newLyric;
};
