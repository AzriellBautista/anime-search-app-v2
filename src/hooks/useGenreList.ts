import { useState, useEffect } from 'react';
import type { Genre } from '../types/anime';
import { fetchGenres } from '../services/tenrai';

const CACHE_KEY = 'anime-search-genres';
const CACHE_TTL = 86400000; // 24 hours

interface GenreCache {
  data: Genre[];
  timestamp: number;
}

function readCache(): Genre[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: GenreCache = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) return null;
    return cached.data;
  } catch {
    return null;
  }
}

function writeCache(data: Genre[]) {
  try {
    const trimmed = data.map((g) => ({ mal_id: g.mal_id, name: g.name }));
    const cached: GenreCache = { data: trimmed as Genre[], timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch { /* storage full or unavailable */ }
}

export function useGenreList() {
  const [genres, setGenres] = useState<Genre[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState(() => readCache() === null);

  useEffect(() => {
    if (readCache() !== null) return;
    let cancelled = false;
    fetchGenres()
      .then((res) => {
        if (!cancelled) {
          setGenres(res.data);
          writeCache(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { genres, loading };
}
