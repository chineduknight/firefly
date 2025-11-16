// src/components/pokemon/PokemonListItem.tsx
import { Box, Flex, Avatar, Text, IconButton } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

import type { PokemonListItem as PokemonListItemType } from "../../types/pokemon";

interface PokemonListItemProps {
  pokemon: PokemonListItemType;
  isSelected: boolean;
  onSelect: () => void;
}

const PokemonListItem = ({
  pokemon,
  isSelected,
  onSelect,
}: PokemonListItemProps) => {
  // const bg = useColorModeValue("white", "gray.800");
  // const selectedBg = useColorModeValue("blue.50", "blue.900");
  const bg = "white";
  const selectedBg = "blue.50";

  return (
    <Box
      as="button"
      onClick={onSelect}
      w="100%"
      textAlign="left"
      bg={isSelected ? selectedBg : bg}
      borderRadius="md"
      borderWidth={isSelected ? "1px" : "0"}
      borderColor={isSelected ? "blue.300" : "transparent"}
      mb={2}
      px={3}
      py={2}
      boxShadow="sm"
      _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
      transition="all 0.15s ease-out"
    >
      <Flex align="center" gap={3}>
        <Avatar.Root>
          <Avatar.Fallback name={pokemon.name} />
          <Avatar.Image src={pokemon.spriteUrl} />
        </Avatar.Root>
        <Text fontWeight="medium" textTransform="capitalize" flex="1">
          {pokemon.name}
        </Text>
        {pokemon.isFavorite && (
          <IconButton
            aria-label="Favorite"
            size="xs"
            colorScheme="yellow"
            variant="ghost"
          >
            <FaStar />
          </IconButton>
        )}
      </Flex>
    </Box>
  );
};

export default PokemonListItem;
