import { Component, type ErrorInfo, type ReactNode } from "react";
import { Center, Button, Text, Heading, VStack } from "@chakra-ui/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Center minH="70vh" px={4}>
          <VStack gap={4}>
            <Heading size="md">Oops, something went wrong.</Heading>
            <Text textAlign="center">
              {this.props.fallbackMessage ??
                "Please try again or refresh the page."}
            </Text>
            <Button onClick={this.handleReload}>Reload</Button>
          </VStack>
        </Center>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
