// src/hooks/usePokemonDetails.ts
import { useQuery } from "@tanstack/react-query";
import { PokemonApi } from "../api/pokemonApi";
import type { PokemonDetails } from "../types/pokemon";

interface UsePokemonDetailsResult {
  data: PokemonDetails | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export const usePokemonDetails = (
  pokemonId: number | null
): UsePokemonDetailsResult => {
  const { data, isLoading, isError, error, refetch } = useQuery<PokemonDetails>(
    {
      queryKey: ["pokemonDetails", pokemonId],
      queryFn: () => {
        if (pokemonId == null) {
          // This should never run because of enabled flag, but TS needs it
          return Promise.reject(new Error("No pokemon id"));
        }
        return PokemonApi.getPokemonDetails(pokemonId);
      },
      enabled: pokemonId != null, // only fetch when we actually have an id
      staleTime: 1000 * 60,
    }
  );

  return {
    data,
    isLoading,
    isError,
    errorMessage: error instanceof Error ? error.message : null,
    refetch,
  };
};
