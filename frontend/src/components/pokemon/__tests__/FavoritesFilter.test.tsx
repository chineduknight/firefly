import type { ReactElement } from "react";
import { render, act } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import FavoritesFilter from "../FavoritesFilter";
import { usePokemonUiStore } from "../../../state/pokemonUiStore";
import { system } from "../../../theme/theme";

const renderWithProviders = (ui: ReactElement) =>
  render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
import { describe, it, expect, beforeEach, afterAll } from "vitest";
describe("FavoritesFilter (store-connected)", () => {
  const initialState = usePokemonUiStore.getState();

  beforeEach(() => {
    // reset to a predictable state for each test
    act(() => {
      usePokemonUiStore.setState({
        ...initialState,
        showFavoritesOnly: false,
      });
    });
  });

  afterAll(() => {
    // restore original state after the whole suite, in case other tests rely on it
    act(() => {
      usePokemonUiStore.setState(initialState);
    });
  });

  it("marks 'All' as active when showFavoritesOnly is false", () => {
    renderWithProviders(<FavoritesFilter />);

    const allButton = screen.getByRole("radio", { name: /all/i });
    const favoritesButton = screen.getByRole("radio", { name: /favorites/i });

    expect(allButton).toHaveAttribute("aria-pressed", "true");
    expect(favoritesButton).toHaveAttribute("aria-pressed", "false");
  });

  it("marks 'Favorites' as active when showFavoritesOnly is true", () => {
    // setup store before render
    act(() => {
      usePokemonUiStore.setState((state) => ({
        ...state,
        showFavoritesOnly: true,
      }));
    });

    renderWithProviders(<FavoritesFilter />);

    const allButton = screen.getByRole("radio", { name: /all/i });
    const favoritesButton = screen.getByRole("radio", { name: /favorites/i });

    expect(allButton).toHaveAttribute("aria-pressed", "false");
    expect(favoritesButton).toHaveAttribute("aria-pressed", "true");
  });

  it("updates store when clicking 'Favorites'", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FavoritesFilter />);

    const favoritesButton = screen.getByRole("radio", { name: /favorites/i });
    await user.click(favoritesButton);

    const state = usePokemonUiStore.getState();
    expect(state.showFavoritesOnly).toBe(true);

    // also reflect in UI
    expect(favoritesButton).toHaveAttribute("aria-pressed", "true");
  });

  it("updates store when clicking 'All'", async () => {
    // start in favorites mode
    act(() => {
      usePokemonUiStore.setState((state) => ({
        ...state,
        showFavoritesOnly: true,
      }));
    });

    const user = userEvent.setup();
    renderWithProviders(<FavoritesFilter />);

    const allButton = screen.getByRole("radio", { name: /all/i });
    await user.click(allButton);

    const state = usePokemonUiStore.getState();
    expect(state.showFavoritesOnly).toBe(false);

    expect(allButton).toHaveAttribute("aria-pressed", "true");
  });
});
