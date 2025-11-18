import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import { ChakraProvider } from "@chakra-ui/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import PokemonCard from "../PokemonCard";
import type { PokemonListItem } from "../../../types/pokemon";
import { useFavoriteActions } from "../../../hooks/useFavoriteActions";
import { system } from "../../../theme/theme";

vi.mock("../../../hooks/useFavoriteActions", () => ({
  useFavoriteActions: vi.fn(),
}));

const renderWithProviders = (ui: ReactElement) =>
  render(<ChakraProvider value={system}>{ui}</ChakraProvider>);

const basePokemon: PokemonListItem = {
  id: 1,
  name: "pikachu",
  spriteUrl: "https://example.com/pika.png",
  isFavorite: false,
};

const mockFavoriteActions = {
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  isAdding: false,
  isRemoving: false,
};

const mockedUseFavoriteActions = useFavoriteActions as unknown as any;

describe("PokemonCard", () => {
  beforeEach(() => {
    mockFavoriteActions.addFavorite.mockReset();
    mockFavoriteActions.removeFavorite.mockReset();
    mockedUseFavoriteActions.mockReturnValue(mockFavoriteActions);
  });

  const setup = (overrides: Partial<PokemonListItem> = {}) => {
    const pokemon = { ...basePokemon, ...overrides };
    const onSelect = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<PokemonCard pokemon={pokemon} onSelect={onSelect} />);

    return { pokemon, onSelect, user };
  };

  it("renders the pokemon name and image", () => {
    setup();

    expect(screen.getByRole("heading", { name: /pikachu/i })).toBeVisible();
    const img = screen.getByRole("img", { name: /pikachu/i });
    expect(img).toHaveAttribute("src", basePokemon.spriteUrl);
  });

  it("calls onSelect when card is clicked", async () => {
    const { onSelect, user } = setup();

    await user.click(screen.getByRole("button", { name: /pikachu details/i }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect when pressing Enter on the card", async () => {
    const { onSelect, user } = setup();
    const card = screen.getByRole("button", { name: /pikachu details/i });

    card.focus();
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("adds to favorites when star is clicked and not already favorite", async () => {
    const { user } = setup({ isFavorite: false });
    const favoriteButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });

    await user.click(favoriteButton);

    expect(mockFavoriteActions.addFavorite).toHaveBeenCalledWith({
      pokemonId: basePokemon.id,
    });
    expect(mockFavoriteActions.removeFavorite).not.toHaveBeenCalled();
  });

  it("removes from favorites when already favorite", async () => {
    const { user, pokemon } = setup({
      isFavorite: true,
      id: 42,
      name: "eevee",
    });
    const favoriteButton = screen.getByRole("button", {
      name: /remove from favorites/i,
    });

    await user.click(favoriteButton);

    expect(mockFavoriteActions.removeFavorite).toHaveBeenCalledWith(pokemon.id);
    expect(mockFavoriteActions.addFavorite).not.toHaveBeenCalled();
  });
});
