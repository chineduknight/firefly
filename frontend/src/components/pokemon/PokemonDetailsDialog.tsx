import {
  Dialog,
  Portal,
  CloseButton,
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  Button,
  Center,
  Icon,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import type { PokemonDetails as PokemonDetailsType } from "../../types/pokemon";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import EvolutionSection from "./EvolutionSection";

interface PokemonDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  pokemon: PokemonDetailsType | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onToggleFavorite: () => void;
  isUpdatingFavorite: boolean;
  onSelectPokemon: (id: number) => void;
}

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <Box>
    <Heading fontSize="md" mb={2} fontWeight="semibold">
      {title}
    </Heading>

    {items.length > 0 ? (
      <Wrap gap={2}>
        {items.map((item, index) => (
          <WrapItem key={`${title}-${item}-${index}`}>
            <Tag.Root
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              bg="gray.100"
            >
              <TagLabel textTransform="capitalize">{item}</TagLabel>
            </Tag.Root>
          </WrapItem>
        ))}
      </Wrap>
    ) : (
      <Text fontSize="sm" color="fg.muted">
        Not available
      </Text>
    )}
  </Box>
);

const EmptyState = () => (
  <Box
    borderWidth="1px"
    borderRadius="md"
    borderColor="gray.200"
    p={6}
    bg="white"
  >
    <Text color="gray.500">Select a Pokémon to see details.</Text>
  </Box>
);
const MotionBox = motion.create(Box);

const PokemonDetailsDialog = ({
  isOpen,
  onClose,
  pokemon,
  isLoading,
  isError,
  errorMessage,
  onToggleFavorite,
  isUpdatingFavorite,
  onSelectPokemon,
}: PokemonDetailsProps) => {
  const showEmpty = !isLoading && !isError && !pokemon;

  const name = pokemon?.name ?? "";
  const spriteUrl = pokemon?.spriteUrl ?? "";
  const types = pokemon?.types ?? [];
  const abilities = pokemon?.abilities ?? [];
  const evolutions = pokemon?.evolutions ?? [];
  const isFavorite = Boolean(pokemon?.isFavorite);
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content
            maxW="lg"
            borderRadius="2xl"
            px={4}
            py={4}
            bg="orange.50"
            boxShadow="lg"
            height="552px"
          >
            <Dialog.Header pb={2}>
              <Flex align="center" justify="space-between" gap={4}>
                <Box textAlign="left">
                  <Dialog.Title
                    textTransform="capitalize"
                    fontSize="2xl"
                    fontWeight="bold"
                  >
                    {name || "Pokémon details"}
                  </Dialog.Title>
                  {name && (
                    <Text fontSize="sm" color="fg.muted">
                      Tap the star to add to favorites
                    </Text>
                  )}
                </Box>

                {pokemon && (
                  <Button
                    size="sm"
                    variant={isFavorite ? "solid" : "outline"}
                    colorPalette="yellow"
                    loading={isUpdatingFavorite}
                    onClick={onToggleFavorite}
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Icon
                      as={FaStar}
                      color={isFavorite ? "yellow.500" : "gray.500"}
                    />
                    {isFavorite ? "Unfavorite" : "Favorite"}
                  </Button>
                )}
              </Flex>
            </Dialog.Header>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top="4" right="4" />
            </Dialog.CloseTrigger>

            <Dialog.Body pt={4}>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <Center key="loading" minH="200px">
                    <Loader message="Loading details..." />
                  </Center>
                ) : isError ? (
                  <Center key="error" minH="200px">
                    <ErrorState
                      message={errorMessage ?? "Failed to load Pokémon details"}
                    />
                  </Center>
                ) : showEmpty ? (
                  <Center key="empty" minH="200px">
                    <EmptyState />
                  </Center>
                ) : (
                  <MotionBox
                    key={pokemon?.id ?? "pokemon"}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Flex align="center" justify="center" mb={4}>
                      {spriteUrl ? (
                        <Image
                          src={spriteUrl}
                          alt={name}
                          boxSize="150px"
                          objectFit="cover"
                          borderRadius="full"
                          borderWidth="4px"
                          borderColor="orange.200"
                          borderStyle="solid"
                        />
                      ) : (
                        <Box
                          boxSize="150px"
                          borderRadius="full"
                          borderWidth="4px"
                          borderColor="orange.200"
                          borderStyle="solid"
                        />
                      )}
                    </Flex>

                    <Flex direction="column" gap={6}>
                      <Section title="Types" items={types} />
                      <Section title="Abilities" items={abilities} />
                      <EvolutionSection
                        evolutions={evolutions}
                        onSelectPokemon={onSelectPokemon}
                      />
                    </Flex>
                  </MotionBox>
                )}
              </AnimatePresence>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PokemonDetailsDialog;
