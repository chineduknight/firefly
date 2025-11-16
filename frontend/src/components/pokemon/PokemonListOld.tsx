// src/components/pokemon/PokemonList.tsx
import { Box, Text } from "@chakra-ui/react";
import type { PokemonListItem as PokemonListItemType } from "../../types/pokemon";
import PokemonListItem from "./PokemonListItem";
import InfiniteScrollSentinel from "./InfiniteScrollSentinel";
import EmptyState from "../common/EmptyState";

interface PokemonListProps {
  items: PokemonListItemType[];
  total: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const PokemonList = ({
  items,
  total,
  selectedId,
  onSelect,
  onLoadMore,
  hasMore,
}: PokemonListProps) => {
  if (items.length === 0) {
    return (
      <EmptyState message="No Pokémon found. Try adjusting your filters." />
    );
  }

  return (
    <Box
      bg="gray.50"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      p={2}
      maxH="70vh"
      overflowY="auto"
    >
      <Text fontSize="xs" color="gray.500" mb={2}>
        Showing {items.length} / {total}
      </Text>

      {items.map((pokemon) => (
        <PokemonListItem
          key={pokemon.id}
          pokemon={pokemon}
          isSelected={selectedId === pokemon.id}
          onSelect={() => onSelect(pokemon.id)}
        />
      ))}

      <InfiniteScrollSentinel isActive={hasMore} onVisible={onLoadMore} />
    </Box>
  );
};

export default PokemonList;
