export interface AnimeImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface Trailer {
  youtube_id: string;
  url: string;
  embed_url: string;
}

export interface Title {
  type: string;
  title: string;
}

export interface AiredProp {
  day: number;
  month: number;
  year: number;
}

export interface Aired {
  from: string;
  to: string;
  prop: {
    from: AiredProp;
    to: AiredProp;
  };
}

export interface MalEntity {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Broadcast {
  day: string;
  time: string;
  timezone: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImages;
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: Broadcast;
  producers: MalEntity[];
  licensors: MalEntity[];
  studios: MalEntity[];
  genres: MalEntity[];
  explicit_genres: MalEntity[];
  themes: MalEntity[];
  demographics: MalEntity[];
}

export interface PaginationItems {
  count: number;
  total: number;
  per_page: number;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: PaginationItems;
}

export interface AnimeResponse {
  data: Anime[];
  pagination: Pagination;
}

export interface Genre extends MalEntity {
  count: number;
}

export interface GenreResponse {
  data: Genre[];
}

export interface CharacterEntry {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string; small_image_url?: string };
    webp?: { image_url: string; small_image_url: string };
  };
  name: string;
}

export interface VoiceActor {
  person: {
    mal_id: number;
    url: string;
    images: { jpg: { image_url: string } };
    name: string;
  };
  language: string;
}

export interface AnimeCharacter {
  character: CharacterEntry;
  role: string;
  favorites: number;
  voice_actors: VoiceActor[];
}

export interface AnimeCharactersResponse {
  data: AnimeCharacter[];
}

export interface AnimePicturesResponse {
  data: AnimeImages[];
}

export interface AnimeScore {
  score: number;
  votes: number;
  percentage: number;
}

export interface AnimeStatistics {
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_watch: number;
  total: number;
  scores: AnimeScore[];
}

export interface AnimeStatisticsResponse {
  data: AnimeStatistics;
}

export interface RelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeRelation {
  relation: string;
  entry: RelationEntry[];
}

export interface AnimeRelationsResponse {
  data: AnimeRelation[];
}

export interface RecommendationEntry {
  mal_id: number;
  url: string;
  images: AnimeImages;
  title: string;
}

export interface AnimeRecommendation {
  entry: RecommendationEntry;
  url: string;
  votes: number;
}

export interface AnimeRecommendationsResponse {
  data: AnimeRecommendation[];
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: string;
  score?: number;
  min_score?: number;
  max_score?: number;
  status?: string;
  rating?: string;
  sfw?: boolean;
  genres?: string;
  genres_exclude?: string;
  order_by?: string;
  sort?: string;
  letter?: string;
  producers?: string;
  start_date?: string;
  end_date?: string;
  unapproved?: boolean;
}

export interface SavedSearch {
  id: string;
  name: string;
  params: SearchParams;
  createdAt: number;
}
