import { Flex, Heading, Box, Image, Icon, Spinner } from "@chakra-ui/react";
import type { PokemonListItem as PokemonListItemType } from "../../types/pokemon";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { useFavoriteActions } from "../../hooks/useFavoriteActions";

interface PokemonListItemProps {
  pokemon: PokemonListItemType;
  onSelect: () => void;
}
const PokemonCard = (props: PokemonListItemProps) => {
  const { pokemon, onSelect: onClick } = props;
  const { name } = pokemon;
  const imageURL = pokemon.spriteUrl;
  const FavoriteIcon = pokemon.isFavorite ? FaStar : FaRegStar;
  const { addFavorite, removeFavorite, isAdding, isRemoving } =
    useFavoriteActions();

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const onToggleFavorite = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (pokemon.isFavorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite({ pokemonId: pokemon.id });
    }
  };
  return (
    <Flex
      role="button"
      tabIndex={0}
      aria-pressed={false}
      aria-label={`${name} details`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      bg="#f5f5f5"
      margin="8px"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      w="320px"
      h="262px"
      borderRadius="16px"
      position="relative"
      transition="transform 0.2s ease-out, box-shadow 0.2s ease-out"
      _hover={{
        boxShadow: "lg",
        transform: "translateY(-4px)",
        cursor: "pointer",
      }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: "teal.400",
        boxShadow: "0 0 0 1px rgba(56, 178, 172, 0.6)",
      }}
    >
      <Box
        position="absolute"
        top="8px"
        right="8px"
        zIndex={1}
        cursor="pointer"
        color={pokemon.isFavorite ? "yellow.400" : "gray.400"}
        _hover={{
          color: pokemon.isFavorite ? "yellow.300" : "gray.500",
        }}
        transition="color 0.2s ease"
        onClick={(e) => {
          onToggleFavorite(e);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(e);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          pokemon.isFavorite ? "Remove from favorites" : "Add to favorites"
        }
      >
        {isAdding || isRemoving ? (
          <Spinner size="sm" />
        ) : (
          <Icon as={FavoriteIcon} boxSize={6} />
        )}
      </Box>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        backgroundImage={`url('https://assets.website-files.com/619abba0bb2a7f61e7cf95b8/619c06178f2a8c45b4966465_pokeball.png')`}
        backgroundPosition="center"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundAttachment="scroll"
      >
        <Image w="192px" src={imageURL} alt={name} />
      </Box>

      <Box
        width="90%"
        padding="8px 0px"
        borderRadius="5px"
        backgroundColor="#fcfcfc"
        boxShadow="1px 1px 7px -2px #000"
        mb="10px"
      >
        <Heading
          as="h2"
          textTransform="capitalize"
          fontSize="32px"
          lineHeight="1.4"
          textAlign="center"
        >
          {name}
        </Heading>
      </Box>
    </Flex>
  );
};

export default PokemonCard;
