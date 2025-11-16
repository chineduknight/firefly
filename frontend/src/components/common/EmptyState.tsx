import { Center, Text } from "@chakra-ui/react";

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <Center py={8}>
    <Text color="gray.500">{message}</Text>
  </Center>
);

export default EmptyState;
