import axios from "axios";
import { config } from "../config/env";
import { globalCache } from "../utils/cache";
import { withPokeApiResilience } from "../utils/resilience";
const CACHE_TTL_MS = 5 * 60 * 1000;
export interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

export interface PokeApiEvolutionChainResponse {
  chain: EvolutionChainLink;
}

export interface PokeApiListResult {
  name: string;
  url: string;
}

export interface PokeApiListResponse {
  count: number;
  results: PokeApiListResult[];
}

export interface PokeApiPokemonResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default: string | null;
      };
    };
  };
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
}

export interface PokeApiSpeciesResponse {
  evolution_chain: { url: string };
}

const api = axios.create({
  baseURL: config.pokeApiBaseUrl,
  headers: {
    "Cache-Control": "no-cache",
  },
});
const getCacheBust = () => Math.floor(Date.now() / 60000);
export const fetchPokemonList = async (params: {
  offset: number;
  limit: number;
}): Promise<PokeApiListResponse> => {
  const { offset, limit } = params;
  const cacheKey = `pokemon:list:${offset}:${limit}`;

  const cached = globalCache.get<PokeApiListResponse>(cacheKey);
  if (cached) return cached;

  const data = await withPokeApiResilience(async () => {
    const response = await api.get<PokeApiListResponse>("/pokemon", {
      params: { limit, offset, cb: getCacheBust() },
    });
    return response.data;
  });

  globalCache.set(cacheKey, data, CACHE_TTL_MS);
  return data;
};

export const fetchPokemonDetails = async (
  id: number
): Promise<PokeApiPokemonResponse> => {
  const cacheKey = `pokemon:details:${id}`;

  const cached = globalCache.get<PokeApiPokemonResponse>(cacheKey);
  if (cached) return cached;

  const data = await withPokeApiResilience(async () => {
    const response = await api.get<PokeApiPokemonResponse>(`/pokemon/${id}`, {
      params: { cb: getCacheBust() },
    });
    return response.data;
  });

  globalCache.set(cacheKey, data, CACHE_TTL_MS);
  return data;
};

export const fetchPokemonSpecies = async (
  id: number
): Promise<PokeApiSpeciesResponse> => {
  const cacheKey = `pokemon:species:${id}`;

  const cached = globalCache.get<PokeApiSpeciesResponse>(cacheKey);
  if (cached) return cached;

  const data = await withPokeApiResilience(async () => {
    const response = await api.get<PokeApiSpeciesResponse>(
      `/pokemon-species/${id}`
    );
    return response.data;
  });

  globalCache.set(cacheKey, data, CACHE_TTL_MS);
  return data;
};

export const fetchEvolutionChain = async (
  url: string
): Promise<PokeApiEvolutionChainResponse> => {
  const cacheKey = `pokemon:evo:${url}`;

  const cached = globalCache.get<PokeApiEvolutionChainResponse>(cacheKey);
  if (cached) return cached;

  const data = await withPokeApiResilience(async () => {
    const response = await axios.get<PokeApiEvolutionChainResponse>(url);
    return response.data;
  });

  globalCache.set(cacheKey, data, CACHE_TTL_MS);
  return data;
};
