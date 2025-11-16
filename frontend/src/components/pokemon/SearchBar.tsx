// src/components/pokemon/SearchBar.tsx
import { InputGroup, Input, Box } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <Box mb={3}>
    <InputGroup startElement={<FiSearch color="gray.400" />}>
      <Input
        placeholder="Search Pokémon by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        bg="white"
        width="60vw"
      />
    </InputGroup>
  </Box>
);

export default SearchBar;
