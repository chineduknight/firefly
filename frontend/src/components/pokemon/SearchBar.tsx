import { InputGroup, Input, Box } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { usePokemonUiStore } from "../../state/pokemonUiStore";

const SearchBar = () => {
  const searchTerm = usePokemonUiStore((s) => s.searchTerm);
  const setSearchTerm = usePokemonUiStore((s) => s.setSearchTerm);

  return (
    <Box mb={3}>
      <InputGroup startElement={<FiSearch color="gray.400" />}>
        <Input
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="white"
          width={{ base: "100%", md: "60vw" }}
          aria-label="Search Pokémon by name"
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
