import ky from 'ky';
import type { AnimeResponse, GenreResponse, SearchParams } from '../types/anime';

const api = ky.create({
  prefix: 'https://api.jikan.moe/v4',
  timeout: 10000,
  retry: 1,
});

export async function fetchAnime(params: SearchParams): Promise<AnimeResponse> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  return api.get('anime', { searchParams }).json<AnimeResponse>();
}

export async function fetchGenres(): Promise<GenreResponse> {
  return api.get('genres/anime').json<GenreResponse>();
}
