import { http } from "./httpClient";
import type { PokemonDetails, PokemonListResponse } from "../types/pokemon";

const DEFAULT_LIMIT = 30;

export const PokemonApi = {
  getPokemonList: async (
    offset = 0,
    limit = DEFAULT_LIMIT,
    search = ""
  ): Promise<PokemonListResponse> => {
    const params: Record<string, string | number> = { offset, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    return http.get<PokemonListResponse>(`/pokemon`, { params });
  },

  getPokemonDetails: async (id: number): Promise<PokemonDetails> => {
    return http.get<PokemonDetails>(`/pokemon/${id}`);
  },
};
