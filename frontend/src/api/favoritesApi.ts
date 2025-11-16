import { http } from "./httpClient";
import type { FavoritePokemon, FavoritePokemonPayload } from "../types/pokemon";

export const FavoritesApi = {
  getFavorites: async (): Promise<{ items: FavoritePokemon[] }> => {
    return http.get<{ items: FavoritePokemon[] }>("/favorites");
  },

  addFavorite: async (
    payload: FavoritePokemonPayload
  ): Promise<FavoritePokemon> => {
    return http.post<FavoritePokemon>("/favorites", payload);
  },

  removeFavorite: async (pokemonId: number): Promise<void> => {
    return http.delete<void>(`/favorites/${pokemonId}`);
  },
};
