import { Box, Flex, Image, Text } from "@chakra-ui/react";
import SearchBar from "../pokemon/SearchBar";
import FavoritesFilter from "../pokemon/FavoritesFilter";
import { bannerURL } from "../../constants";
import { usePokemonList } from "../../hooks/usePokemonList";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { usePokemonUiStore } from "../../state/pokemonUiStore";

const PokemonHomeHeader = () => {
  const searchTerm = usePokemonUiStore((s) => s.searchTerm);
  const showFavoritesOnly = usePokemonUiStore((s) => s.showFavoritesOnly);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const { items, total, isLoading, isError } = usePokemonList({
    searchTerm: debouncedSearchTerm,
    showFavoritesOnly,
  });

  return (
    <Box
      as="header"
      w="100%"
      borderBottom="1px solid"
      borderColor="gray.200"
      py={4}
      px={{ base: 4, md: 8 }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap={4}
      >
        <Flex align="center" gap={4}>
          <Image src={bannerURL} maxH="60px" objectFit="contain" />
        </Flex>

        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          gap={3}
        >
          {!isLoading && !isError && <SearchBar />}
          <FavoritesFilter />
        </Flex>
      </Flex>

      <Text fontSize="xs" color="gray.500" mt={2}>
        Showing {items.length} / {total}
      </Text>
    </Box>
  );
};

export default PokemonHomeHeader;
