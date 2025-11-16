import axios from "axios";
import { config } from "../config/env";
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
});

export const fetchPokemonList = async (params: {
  offset: number;
  limit: number;
}): Promise<PokeApiListResponse> => {
  const { offset, limit } = params;

  const response = await api.get<PokeApiListResponse>("/pokemon", {
    params: { limit, offset },
  });

  return response.data;
};

export const fetchPokemonDetails = async (
  id: number
): Promise<PokeApiPokemonResponse> => {
  const response = await api.get<PokeApiPokemonResponse>(`/pokemon/${id}`);
  return response.data;
};

export const fetchPokemonSpecies = async (
  id: number
): Promise<PokeApiSpeciesResponse> => {
  const response = await api.get<PokeApiSpeciesResponse>(
    `/pokemon-species/${id}`
  );
  return response.data;
};

export const fetchEvolutionChain = async (
  url: string
): Promise<PokeApiEvolutionChainResponse> => {
  const response = await axios.get<PokeApiEvolutionChainResponse>(url);
  return response.data;
};
