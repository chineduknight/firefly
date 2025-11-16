export interface PokemonListItem {
  id: number;
  name: string;
  spriteUrl: string;
  isFavorite: boolean;
}
export interface PokemonListPageMeta {
  offset: number;
  limit: number;
  hasNextPage: boolean;
  nextOffset: number | null;
}
export interface PokemonListResponse {
  items: PokemonListItem[];
  total: number;
  page: PokemonListPageMeta;
}

export interface PokemonEvolution {
  id: number;
  name: string;
}

export interface PokemonDetails extends PokemonListItem {
  types: string[];
  abilities: string[];
  evolutions: PokemonEvolution[];
}
