import {
  FavoritePokemon,
  FavoritePokemonAttrs,
} from "../models/favorites.model";

export interface FavoritesRepository {
  getAll(): Promise<FavoritePokemon[]>;
  getIds(): Promise<number[]>;
  isFavorite(pokemonId: number): Promise<boolean>;
  addFavorite(attrs: FavoritePokemonAttrs): Promise<FavoritePokemon>;
  removeFavorite(pokemonId: number): Promise<void>;
  findByPokemonId(pokemonId: number): Promise<FavoritePokemon | null>;
  createFavorite(attrs: FavoritePokemonAttrs): Promise<FavoritePokemon>;
}
