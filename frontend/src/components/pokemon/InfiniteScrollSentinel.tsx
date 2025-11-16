import { useEffect, useRef } from "react";
import { Box, Spinner } from "@chakra-ui/react";

interface InfiniteScrollSentinelProps {
  isActive: boolean;
  onVisible: () => void;
}

const InfiniteScrollSentinel = ({
  isActive,
  onVisible,
}: InfiniteScrollSentinelProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          onVisible();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [isActive, onVisible]);

  if (!isActive) {
    return null;
  }

  return (
    <Box ref={ref} py={4} textAlign="center">
      <Spinner size="sm" />
    </Box>
  );
};

export default InfiniteScrollSentinel;
