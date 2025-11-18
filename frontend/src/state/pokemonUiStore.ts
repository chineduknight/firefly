import { create } from "zustand";

type PokemonUiState = {
  searchTerm: string;
  showFavoritesOnly: boolean;
  selectedPokemonId: number | null;
  isDetailsOpen: boolean;
};

type PokemonUiActions = {
  setSearchTerm: (value: string) => void;
  setShowFavoritesOnly: (value: boolean) => void;
  openDetails: (id: number) => void;
  closeDetails: () => void;
  setSelectedPokemonId: (id: number | null) => void;
};

export type PokemonUiStore = PokemonUiState & PokemonUiActions;

export const usePokemonUiStore = create<PokemonUiStore>((set) => ({
  searchTerm: "",
  showFavoritesOnly: false,
  selectedPokemonId: null,
  isDetailsOpen: false,

  setSearchTerm: (value) => set({ searchTerm: value }),
  setShowFavoritesOnly: (value) => set({ showFavoritesOnly: value }),

  openDetails: (id) =>
    set({
      selectedPokemonId: id,
      isDetailsOpen: true,
    }),

  closeDetails: () => set({ isDetailsOpen: false }),

  setSelectedPokemonId: (id) => set({ selectedPokemonId: id }),
}));
