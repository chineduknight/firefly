// src/hooks/useFavoriteActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoritesApi } from "../api/favoritesApi";
import type {
  FavoritePokemon,
  FavoritePokemonPayload,
  PokemonDetails,
} from "../types/pokemon";

interface UseFavoriteActionsResult {
  isAdding: boolean;
  isRemoving: boolean;
  addFavorite: (payload: FavoritePokemonPayload) => Promise<void>;
  removeFavorite: (pokemonId: number) => Promise<void>;
}

export const useFavoriteActions = (): UseFavoriteActionsResult => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (payload: FavoritePokemonPayload) =>
      FavoritesApi.addFavorite(payload),
    onSuccess: (createdFavorite: FavoritePokemon) => {
      // Invalidate or update relevant queries
      queryClient.invalidateQueries({ queryKey: ["pokemonList"] });

      // Optimistically update pokemonDetails if present
      const detailsKey = ["pokemonDetails", createdFavorite.pokemonId];
      const existing = queryClient.getQueryData<PokemonDetails>(detailsKey);
      if (existing) {
        queryClient.setQueryData<PokemonDetails>(detailsKey, {
          ...existing,
          isFavorite: true,
        });
      }

      // Also you could invalidate /favorites if you use it anywhere
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (pokemonId: number) => FavoritesApi.removeFavorite(pokemonId),
    onSuccess: (_data, pokemonId) => {
      queryClient.invalidateQueries({ queryKey: ["pokemonList"] });

      const detailsKey = ["pokemonDetails", pokemonId];
      const existing = queryClient.getQueryData<PokemonDetails>(detailsKey);
      if (existing) {
        queryClient.setQueryData<PokemonDetails>(detailsKey, {
          ...existing,
          isFavorite: false,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const addFavorite = async (payload: FavoritePokemonPayload) => {
    await addMutation.mutateAsync(payload);
  };

  const removeFavorite = async (pokemonId: number) => {
    await removeMutation.mutateAsync(pokemonId);
  };

  return {
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    addFavorite,
    removeFavorite,
  };
};
