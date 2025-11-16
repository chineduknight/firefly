import { Button, Center, Text, VStack } from "@chakra-ui/react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <Center py={8}>
    <VStack gap={3}>
      <Text color="red.500" fontWeight="medium">
        {message}
      </Text>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </VStack>
  </Center>
);

export default ErrorState;
