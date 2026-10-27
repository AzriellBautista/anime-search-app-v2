import ky from 'ky';
import type { AnimeResponse, AnimeSingleResponse, GenreResponse, SearchParams, AnimeCharactersResponse, AnimePicturesResponse, AnimeStatisticsResponse, AnimeRelationsResponse, AnimeRecommendationsResponse } from '../types/anime';

const API_BASE_URL = 'https://api.tenrai.org/v1';

const api = ky.create({
  prefix: API_BASE_URL,
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

const animeByIdCache = new Map<number, AnimeSingleResponse>();

export async function fetchAnimeById(id: number): Promise<AnimeSingleResponse> {
  const cached = animeByIdCache.get(id);
  if (cached) return cached;
  const res = await api.get(`anime/${id}`).json<AnimeSingleResponse>();
  animeByIdCache.set(id, res);
  return res;
}

const charactersCache = new Map<number, AnimeCharactersResponse>();
export async function fetchAnimeCharacters(id: number): Promise<AnimeCharactersResponse> {
  const cached = charactersCache.get(id);
  if (cached) return cached;
  const res = await api.get(`anime/${id}/characters`).json<AnimeCharactersResponse>();
  charactersCache.set(id, res);
  return res;
}

const picturesCache = new Map<number, AnimePicturesResponse>();
export async function fetchAnimePictures(id: number): Promise<AnimePicturesResponse> {
  const cached = picturesCache.get(id);
  if (cached) return cached;
  const res = await api.get(`anime/${id}/pictures`).json<AnimePicturesResponse>();
  picturesCache.set(id, res);
  return res;
}

const statisticsCache = new Map<number, AnimeStatisticsResponse>();
export async function fetchAnimeStatistics(id: number): Promise<AnimeStatisticsResponse> {
  const cached = statisticsCache.get(id);
  if (cached) return cached;
  const res = await api.get(`anime/${id}/statistics`).json<AnimeStatisticsResponse>();
  statisticsCache.set(id, res);
  return res;
}

const relationsCache = new Map<number, AnimeRelationsResponse>();
export async function fetchAnimeRelations(id: number): Promise<AnimeRelationsResponse> {
  const cached = relationsCache.get(id);
  if (cached) return cached;
  const res = await api.get(`anime/${id}/relations`).json<AnimeRelationsResponse>();
  relationsCache.set(id, res);
  return res;
}

const recommendationsCache = new Map<number, AnimeRecommendationsResponse>();
export async function fetchAnimeRecommendations(id: number): Promise<AnimeRecommendationsResponse> {
  const cached = recommendationsCache.get(id);
  if (cached) return cached;
  const res = await api.get(`anime/${id}/recommendations`).json<AnimeRecommendationsResponse>();
  recommendationsCache.set(id, res);
  return res;
}
