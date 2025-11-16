import { http } from "./httpClient";
import type { PokemonDetails, PokemonListResponse } from "../types/pokemon";

const DEFAULT_LIMIT = 30;

export const PokemonApi = {
  getPokemonList: async (
    offset = 0,
    limit = DEFAULT_LIMIT
  ): Promise<PokemonListResponse> => {
    return http.get<PokemonListResponse>(
      `/pokemon?offset=${offset}&limit=${limit}`
    );
  },

  getPokemonDetails: async (id: number): Promise<PokemonDetails> => {
    return http.get<PokemonDetails>(`/pokemon/${id}`);
  },
};
