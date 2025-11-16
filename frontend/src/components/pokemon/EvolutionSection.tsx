import {
  Box,
  Heading,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";

const EvolutionSection = ({
  evolutions,
  onSelectPokemon,
}: {
  evolutions: { id: number; name: string }[];
  onSelectPokemon: (id: number) => void;
}) => (
  <Box>
    <Heading fontSize="md" mb={2} fontWeight="semibold">
      Evolutions
    </Heading>

    {evolutions.length > 0 ? (
      <Wrap gap={2}>
        {evolutions.map((evo) => (
          <WrapItem key={evo.id}>
            <Tag.Root
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              bg="purple.100"
              cursor="pointer"
              _hover={{
                bg: "purple.200",
                transform: "translateY(-1px)",
              }}
              onClick={() => onSelectPokemon(evo.id)}
            >
              <TagLabel textTransform="capitalize">{evo.name}</TagLabel>
            </Tag.Root>
          </WrapItem>
        ))}
      </Wrap>
    ) : (
      <Text fontSize="sm" color="fg.muted">
        No evolution data available.
      </Text>
    )}
  </Box>
);

export default EvolutionSection;
