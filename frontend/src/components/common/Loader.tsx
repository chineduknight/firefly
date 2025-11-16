// src/components/common/Loader.tsx
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

interface LoaderProps {
  message?: string;
}

const Loader = ({ message }: LoaderProps) => (
  <Center py={8}>
    <VStack gap={3}>
      <Spinner size="lg" />
      {message && <Text color="gray.500">{message}</Text>}
    </VStack>
  </Center>
);

export default Loader;
