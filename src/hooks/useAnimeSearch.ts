import { useState, useCallback, useRef } from 'react';
import type { Anime, Pagination, SearchParams } from '../types/anime';
import { fetchAnime } from '../services/jikan';

const DEFAULT_PARAMS: SearchParams = {
  page: 1,
  limit: 25,
};

export function useAnimeSearch() {
  const [params, setParams] = useState<SearchParams>(DEFAULT_PARAMS);
  const [data, setData] = useState<Anime[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchVersion, setSearchVersion] = useState(0);
  const fetchIdRef = useRef(0);

  const doFetch = useCallback(async (p: SearchParams) => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAnime(p);
      if (id === fetchIdRef.current) {
        const seen = new Set<number>();
        const unique = res.data.filter((item) => {
          if (seen.has(item.mal_id)) return false;
          seen.add(item.mal_id);
          return true;
        });
        setData(unique);
        setPagination(res.pagination);
        setHasSearched(true);
      }
    } catch (err) {
      if (id === fetchIdRef.current) {
        const msg = err instanceof Error ? err.message : 'Request failed';
        setError(msg);
        setData([]);
        setPagination(null);
        setHasSearched(true);
      }
    } finally {
      if (id === fetchIdRef.current) setLoading(false);
    }
  }, []);

  const search = useCallback((next: SearchParams) => {
    const cleaned: SearchParams = {};
    for (const key of Object.keys(next) as (keyof SearchParams)[]) {
      const val = next[key];
      if (val !== undefined && val !== null && val !== '') {
        (cleaned as Record<string, unknown>)[key] = val;
      }
    }
    setParams(cleaned);
    setHasSearched(true);
    setData([]);
    setSearchVersion((v) => v + 1);
    doFetch(cleaned);
  }, [doFetch]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => {
      const next = { ...prev, page };
      doFetch(next);
      return next;
    });
  }, [doFetch]);

  const reset = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setData([]);
    setPagination(null);
    setHasSearched(false);
    setError(null);
  }, []);

  return {
    data, pagination, loading, error, hasSearched, params, searchVersion,
    search, setPage, reset,
  };
}
