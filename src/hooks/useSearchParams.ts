import { useEffect, useRef } from 'react';
import type { SearchParams } from '../types/anime';

const URL_PARAM_KEYS: (keyof SearchParams)[] = [
  'q', 'page', 'type', 'status', 'rating', 'sfw', 'genres',
  'min_score', 'max_score', 'order_by', 'sort', 'start_date', 'end_date',
];

function readParamsFromUrl(): SearchParams {
  const url = new URL(window.location.href);
  const params: SearchParams = {};
  for (const key of URL_PARAM_KEYS) {
    const val = url.searchParams.get(key);
    if (val === null) continue;
    if (key === 'page' || key === 'min_score' || key === 'max_score') {
      const num = Number(val);
      if (!isNaN(num)) (params as Record<string, unknown>)[key] = num;
    } else if (key === 'sfw') {
      if (val === 'true') params.sfw = true;
    } else {
      (params as Record<string, unknown>)[key] = val;
    }
  }
  return params;
}

function writeParamsToUrl(params: SearchParams): string {
  const url = new URL(window.location.href);
  url.search = '';
  for (const key of URL_PARAM_KEYS) {
    const val = params[key];
    if (val !== undefined && val !== null && val !== '' && key !== 'limit' && !(key === 'page' && val === 1)) {
      url.searchParams.set(key, String(val));
    }
  }
  return url.pathname + url.search;
}

interface UseSearchParamsInput {
  search: (params: SearchParams) => void;
  reset: () => void;
  hasSearched: boolean;
  params: SearchParams;
}

export function useSearchParams(api: UseSearchParamsInput) {
  const isFirstRender = useRef(true);
  const prevKeyRef = useRef('');
  const fromPopState = useRef(false);

  // On mount: read URL and trigger search if params exist
  useEffect(() => {
    const urlParams = readParamsFromUrl();
    const keys = Object.keys(urlParams);
    if (keys.length > 0) {
      api.search({ ...urlParams, page: urlParams.page || 1, limit: 25 });
    }
  }, []);

  // On params change: sync URL with history
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (fromPopState.current) {
      fromPopState.current = false;
      return;
    }

    const key = JSON.stringify(api.params);
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    const currentUrl = window.location.pathname + window.location.search;

    if (!api.hasSearched) {
      const clean = window.location.pathname;
      if (clean !== currentUrl) {
        window.history.pushState(null, '', clean);
      }
      return;
    }

    const nextUrl = writeParamsToUrl(api.params);
    if (nextUrl !== currentUrl) {
      window.history.pushState(null, '', nextUrl);
    }
  }, [api.params, api.hasSearched]);

  // On popstate: restore search from URL
  useEffect(() => {
    const onPopState = () => {
      fromPopState.current = true;
      const urlParams = readParamsFromUrl();
      const keys = Object.keys(urlParams);
      if (keys.length > 0) {
        api.search({ ...urlParams, page: urlParams.page || 1, limit: 25 });
      } else {
        api.reset();
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [api.search, api.reset]);
}
