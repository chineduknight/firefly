// src/state/useUiState.ts
import { useState } from "react";

export interface UiState {
  selectedPokemonId: number | null;
  searchTerm: string;
  showFavoritesOnly: boolean;
}

export interface UseUiStateResult extends UiState {
  setSelectedPokemonId: (id: number | null) => void;
  setSearchTerm: (value: string) => void;
  setShowFavoritesOnly: (value: boolean) => void;
}

export const useUiState = (): UseUiStateResult => {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  return {
    selectedPokemonId,
    searchTerm,
    showFavoritesOnly,
    setSelectedPokemonId,
    setSearchTerm,
    setShowFavoritesOnly,
  };
};
