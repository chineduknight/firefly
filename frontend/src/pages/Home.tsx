import { Text, Image, Flex } from "@chakra-ui/react";
import { useUiState } from "../hooks/useUiState";
import SearchBar from "../components/pokemon/SearchBar";
import { bannerURL } from "../constants";
import PokemonList from "../components/pokemon/PokemonList";
import PokemonDetailsDialog from "../components/pokemon/PokemonDetailsDialog";
import { usePokemonList } from "../hooks/usePokemonList";
import { useState } from "react";
import { usePokemonDetails } from "../hooks/usePokemonDetails";
import { useFavoriteActions } from "../hooks/useFavoriteActions";
import Loader from "../components/common/Loader";
import ErrorState from "../components/common/ErrorState";
import FavoritesToggle from "../components/pokemon/FavoritesToggle";

const Home = () => {
  const {
    selectedPokemonId,
    searchTerm,
    showFavoritesOnly,
    setSelectedPokemonId,
    setSearchTerm,
    setShowFavoritesOnly,
  } = useUiState();

  const {
    items,
    total,
    isLoading: isListLoading,
    isError: isListError,
    errorMessage: listErrorMessage,
    loadMore,
    hasMore,
    refetch: refetchList,
  } = usePokemonList({ searchTerm, showFavoritesOnly });
  const {
    data: selectedPokemon,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
    errorMessage: detailsErrorMessage,
  } = usePokemonDetails(selectedPokemonId);
  const { addFavorite, removeFavorite, isAdding, isRemoving } =
    useFavoriteActions();

  const handleToggleFavorite = () => {
    if (!selectedPokemon) return;

    const payload = {
      pokemonId: selectedPokemon.id,
      name: selectedPokemon.name,
      spriteUrl: selectedPokemon.spriteUrl,
      types: selectedPokemon.types,
    };

    if (selectedPokemon.isFavorite) {
      removeFavorite(selectedPokemon.id);
    } else {
      addFavorite(payload);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex
      mb="50px"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      <PokemonDetailsDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pokemon={selectedPokemon}
        isLoading={isDetailsLoading}
        isError={isDetailsError}
        errorMessage={detailsErrorMessage}
        onToggleFavorite={handleToggleFavorite}
        isUpdatingFavorite={isAdding || isRemoving}
        onSelectPokemon={(id: number) => {
          setSelectedPokemonId(id);
        }}
      />

      <Image src={bannerURL} />

      {isListLoading && <Loader message="Loading Pokémon..." />}

      {isListError && (
        <ErrorState
          message={listErrorMessage ?? "Failed to load Pokémon"}
          onRetry={refetchList}
        />
      )}
      {isListLoading || isListError ? null : (
        <>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FavoritesToggle
            value={showFavoritesOnly}
            onChange={setShowFavoritesOnly}
          />
          <Text fontSize="xs" color="gray.500" mb={2}>
            Showing {items.length} / {total}
          </Text>
        </>
      )}
      {!isListLoading && !isListError && (
        <PokemonList
          items={items}
          onSelect={(id: number) => {
            setSelectedPokemonId(id);
            setIsOpen(true);
          }}
          onLoadMore={loadMore}
          hasMore={hasMore}
          showFavoritesOnly={showFavoritesOnly}
          hasSearchTerm={Boolean(searchTerm.trim())}
        />
      )}
    </Flex>
  );
};

export default Home;
