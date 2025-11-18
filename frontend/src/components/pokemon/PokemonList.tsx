import { Flex } from "@chakra-ui/react";
import type { PokemonListItem as PokemonListItemType } from "../../types/pokemon";
import InfiniteScrollSentinel from "./InfiniteScrollSentinel";
import EmptyState from "../common/EmptyState";
import PokemonCard from "./PokemonCard";
import { usePokemonUiStore } from "../../state/pokemonUiStore";

interface PokemonListProps {
  items: PokemonListItemType[];
  onSelect: (id: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  hasSearchTerm: boolean;
}

const PokemonList = ({
  items,
  onSelect,
  onLoadMore,
  hasMore,
  hasSearchTerm,
}: PokemonListProps) => {
  const showFavoritesOnly = usePokemonUiStore((s) => s.showFavoritesOnly);
  if (items.length === 0) {
    return (
      <EmptyState message="No Pokémon found. Try adjusting your filters." />
    );
  }

  return (
    <Flex
      maxH="85vh"
      wrap="wrap"
      justify="center"
      gap="20px"
      overflowY="auto"
      pb="40px"
    >
      {items.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onSelect={() => onSelect(pokemon.id)}
        />
      ))}

      <InfiniteScrollSentinel
        isActive={hasMore && !showFavoritesOnly && !hasSearchTerm}
        onVisible={onLoadMore}
      />
    </Flex>
  );
};

export default PokemonList;
