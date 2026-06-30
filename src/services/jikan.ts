import ky from 'ky';
import type { AnimeResponse, GenreResponse, SearchParams, AnimeCharactersResponse, AnimePicturesResponse, AnimeStatisticsResponse, AnimeRelationsResponse, AnimeRecommendationsResponse } from '../types/anime';

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

export async function fetchAnimeCharacters(id: number): Promise<AnimeCharactersResponse> {
  return api.get(`anime/${id}/characters`).json<AnimeCharactersResponse>();
}

export async function fetchAnimePictures(id: number): Promise<AnimePicturesResponse> {
  return api.get(`anime/${id}/pictures`).json<AnimePicturesResponse>();
}

export async function fetchAnimeStatistics(id: number): Promise<AnimeStatisticsResponse> {
  return api.get(`anime/${id}/statistics`).json<AnimeStatisticsResponse>();
}

export async function fetchAnimeRelations(id: number): Promise<AnimeRelationsResponse> {
  return api.get(`anime/${id}/relations`).json<AnimeRelationsResponse>();
}

export async function fetchAnimeRecommendations(id: number): Promise<AnimeRecommendationsResponse> {
  return api.get(`anime/${id}/recommendations`).json<AnimeRecommendationsResponse>();
}
