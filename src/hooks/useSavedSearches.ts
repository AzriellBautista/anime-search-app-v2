import { useState, useEffect, useCallback } from 'react';
import type { SavedSearch, SearchParams } from '../types/anime';

const STORAGE_KEY = 'saved-searches';

function load(): SavedSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
  }, [savedSearches]);

  const saveSearch = useCallback((name: string, params: SearchParams) => {
    const saved: SearchParams = { ...params };
    delete saved.page;
    delete saved.limit;
    const lcName = name.toLowerCase();
    const entry: SavedSearch = {
      id: crypto.randomUUID(),
      name: lcName,
      params: saved,
      createdAt: Date.now(),
    };
    setSavedSearches((prev) => {
      const existing = prev.findIndex((s) => s.name === lcName);
      if (existing !== -1) {
        const next = [...prev];
        next[existing] = entry;
        return next;
      }
      return [entry, ...prev];
    });
  }, []);

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { savedSearches, saveSearch, deleteSearch };
}
