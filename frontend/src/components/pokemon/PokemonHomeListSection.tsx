import { Box } from "@chakra-ui/react";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import PokemonList from "../pokemon/PokemonList";
import { usePokemonList } from "../../hooks/usePokemonList";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { usePokemonUiStore } from "../../state/pokemonUiStore";

const PokemonHomeListSection = () => {
  const searchTerm = usePokemonUiStore((s) => s.searchTerm);
  const showFavoritesOnly = usePokemonUiStore((s) => s.showFavoritesOnly);
  const openDetails = usePokemonUiStore((s) => s.openDetails);

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const hasSearchTerm = Boolean(searchTerm.trim());

  const {
    items,
    isLoading,
    isError,
    errorMessage,
    loadMore,
    hasMore,
    refetch,
  } = usePokemonList({
    searchTerm: debouncedSearchTerm,
    showFavoritesOnly,
  });

  return (
    <Box
      as="main"
      flex="1"
      w="100%"
      px={{ base: 4, md: 8 }}
      py={6}
      display="flex"
      justifyContent="center"
    >
      {isLoading && <Loader message="Loading Pokémon..." />}

      {isError && (
        <ErrorState
          message={errorMessage ?? "Failed to load Pokémon"}
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && (
        <PokemonList
          items={items}
          onSelect={openDetails}
          onLoadMore={loadMore}
          hasMore={hasMore}
          hasSearchTerm={hasSearchTerm}
        />
      )}
    </Box>
  );
};

export default PokemonHomeListSection;
