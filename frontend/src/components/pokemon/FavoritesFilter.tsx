import { Button, ButtonGroup } from "@chakra-ui/react";
import { usePokemonUiStore } from "../../state/pokemonUiStore";

type Mode = "all" | "favorites";

const FavoritesFilter = () => {
  const showFavoritesOnly = usePokemonUiStore((s) => s.showFavoritesOnly);
  const setShowFavoritesOnly = usePokemonUiStore((s) => s.setShowFavoritesOnly);

  const mode: Mode = showFavoritesOnly ? "favorites" : "all";

  const handleChange = (nextMode: Mode) => {
    setShowFavoritesOnly(nextMode === "favorites");
  };

  return (
    <ButtonGroup
      size="sm"
      variant="outline"
      role="radiogroup"
      aria-label="Filter by favorites"
    >
      <Button
        onClick={() => handleChange("all")}
        variant={mode === "all" ? "solid" : "outline"}
        aria-pressed={mode === "all"}
        role="radio"
      >
        All
      </Button>
      <Button
        onClick={() => handleChange("favorites")}
        variant={mode === "favorites" ? "solid" : "outline"}
        aria-pressed={mode === "favorites"}
        role="radio"
      >
        Favorites
      </Button>
    </ButtonGroup>
  );
};

export default FavoritesFilter;
