import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PokemonApi } from "../api/pokemonApi";
import type { PokemonListItem, PokemonListResponse } from "../types/pokemon";

const PAGE_SIZE = 30;

interface UsePokemonListOptions {
  searchTerm?: string;
  showFavoritesOnly?: boolean;
}

interface UsePokemonListResult {
  items: PokemonListItem[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  loadMore: () => void;
  hasMore: boolean;
  refetch: () => void;
  isFetchingNextPage: boolean;
}

export const usePokemonList = (
  options: UsePokemonListOptions = {}
): UsePokemonListResult => {
  const { searchTerm = "", showFavoritesOnly = false } = options;
  const normalizedSearch = searchTerm.trim();

  const query = useInfiniteQuery<PokemonListResponse, Error>({
    queryKey: ["pokemonList", normalizedSearch],
    queryFn: ({ pageParam = 0 }) =>
      PokemonApi.getPokemonList(
        pageParam as number,
        PAGE_SIZE,
        normalizedSearch
      ),
    initialPageParam: 0,
    staleTime: 1000 * 60,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (!lastPage.page) return undefined;
      return lastPage.page.hasNextPage ? lastPage.page.nextOffset : undefined;
    },
  });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = query;

  // ✅ data.pages is an array of PokemonListResponse
  const allItems: PokemonListItem[] = useMemo(
    () => (data?.pages ? data.pages.flatMap((page) => page.items) : []),
    [data]
  );

  // total comes from the first page (server-side search)
  const total: number = useMemo(
    () => (data?.pages?.length ? data.pages[0].total : 0),
    [data]
  );

  // Only favorites filter is client-side
  const filteredItems: PokemonListItem[] = useMemo(() => {
    if (!showFavoritesOnly) return allItems;
    return allItems.filter((item) => item.isFavorite);
  }, [allItems, showFavoritesOnly]);

  const loadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return {
    items: filteredItems,
    total,
    isLoading,
    isError,
    errorMessage: error instanceof Error ? error.message : null,
    loadMore,
    hasMore: Boolean(hasNextPage),
    refetch,
    isFetchingNextPage,
  };
};
