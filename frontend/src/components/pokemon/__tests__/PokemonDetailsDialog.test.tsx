import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import PokemonDetailsDialog from "../PokemonDetailsDialog";
import { system } from "../../../theme/theme";
import { usePokemonDetails } from "../../../hooks/usePokemonDetails";
import { useFavoriteActions } from "../../../hooks/useFavoriteActions";

const renderWithProviders = (ui: ReactElement) =>
  render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

vi.mock("../../../hooks/usePokemonDetails", () => ({
  usePokemonDetails: vi.fn(),
}));

vi.mock("../../../hooks/useFavoriteActions", () => ({
  useFavoriteActions: vi.fn(),
}));

const storeMock = {
  selectedPokemonId: 25,
  isDetailsOpen: true,
  closeDetails: vi.fn(),
  setSelectedPokemonId: vi.fn(),
};

vi.mock("../../../state/pokemonUiStore", () => ({
  usePokemonUiStore: (selector: (state: typeof storeMock) => unknown) =>
    selector(storeMock),
}));

const mockPokemonDetails = usePokemonDetails as unknown as any;
const mockFavoriteActions = {
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  isAdding: false,
  isRemoving: false,
};

const mockUseFavoriteActions = useFavoriteActions as unknown as any;

const basePokemon = {
  id: 25,
  name: "pikachu",
  spriteUrl: "sprite.png",
  isFavorite: false,
  types: ["electric"],
  abilities: ["static"],
  evolutions: [{ id: 26, name: "raichu" }],
};

describe("PokemonDetailsDialog", () => {
  beforeEach(() => {
    mockPokemonDetails.mockReset();
    mockUseFavoriteActions.mockReturnValue(mockFavoriteActions);
    mockFavoriteActions.addFavorite.mockReset();
    mockFavoriteActions.removeFavorite.mockReset();
    storeMock.isDetailsOpen = true;
    storeMock.selectedPokemonId = 25;
    storeMock.closeDetails.mockReset();
    storeMock.setSelectedPokemonId.mockReset();
  });

  it("renders loading state", () => {
    mockPokemonDetails.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      errorMessage: null,
    });

    renderWithProviders(<PokemonDetailsDialog />);

    expect(screen.getByText(/Loading details/i)).toBeVisible();
  });

  it("renders error state", () => {
    mockPokemonDetails.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      errorMessage: "Boom",
    });

    renderWithProviders(<PokemonDetailsDialog />);

    expect(screen.getByText(/Boom/)).toBeVisible();
  });

  it("renders empty state when no pokemon selected", () => {
    mockPokemonDetails.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      errorMessage: null,
    });

    renderWithProviders(<PokemonDetailsDialog />);

    expect(screen.getByText(/Select a Pokémon/i)).toBeVisible();
  });

  it("shows pokemon data when loaded", () => {
    mockPokemonDetails.mockReturnValue({
      data: basePokemon,
      isLoading: false,
      isError: false,
      errorMessage: null,
    });

    renderWithProviders(<PokemonDetailsDialog />);

    expect(screen.getByRole("heading", { name: /pikachu/i })).toBeVisible();
    expect(screen.getByRole("img", { name: /pikachu/i })).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/static/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add.*favorites/i })
    ).toBeVisible();
  });

  it("calls addFavorite when clicking favorite button", async () => {
    const user = userEvent.setup();

    mockPokemonDetails.mockReturnValue({
      data: basePokemon,
      isLoading: false,
      isError: false,
      errorMessage: null,
    });

    renderWithProviders(<PokemonDetailsDialog />);

    await user.click(screen.getByRole("button", { name: /add.*favorites/i }));

    expect(mockFavoriteActions.addFavorite).toHaveBeenCalledWith({
      pokemonId: basePokemon.id,
    });
  });

  it("calls removeFavorite when clicking button for favorite pokemon", async () => {
    const user = userEvent.setup();

    mockPokemonDetails.mockReturnValue({
      data: { ...basePokemon, isFavorite: true },
      isLoading: false,
      isError: false,
      errorMessage: null,
    });

    renderWithProviders(<PokemonDetailsDialog />);

    await user.click(
      screen.getByRole("button", { name: /remove.*favorites/i })
    );

    expect(mockFavoriteActions.removeFavorite).toHaveBeenCalledWith(
      basePokemon.id
    );
  });

  it("closes dialog when close button clicked", async () => {
    const user = userEvent.setup();

    mockPokemonDetails.mockReturnValue({
      data: basePokemon,
      isLoading: false,
      isError: false,
      errorMessage: null,
    });

    renderWithProviders(<PokemonDetailsDialog />);

    await user.click(
      screen.getByRole("button", { name: /close pokémon details/i })
    );

    expect(storeMock.closeDetails).toHaveBeenCalled();
  });
});
