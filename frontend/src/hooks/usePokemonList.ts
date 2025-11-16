// src/hooks/usePokemonList.ts
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

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery<PokemonListResponse, Error>({
    queryKey: ["pokemonList"],
    queryFn: ({ pageParam = 0 }) =>
      PokemonApi.getPokemonList(pageParam as number, PAGE_SIZE),
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNextPage ? lastPage.page.nextOffset : undefined,
    staleTime: 1000 * 60,
    initialPageParam: 0,
  });

  const allItems: PokemonListItem[] = useMemo(
    () => (data?.pages ? data.pages.flatMap((page) => page.items) : []),
    [data]
  );

  const total: number = useMemo(
    () => (data?.pages && data.pages.length ? data.pages[0].total : 0),
    [data]
  );

  const filteredItems: PokemonListItem[] = useMemo(() => {
    let items = allItems;

    if (showFavoritesOnly) {
      items = items.filter((item) => item.isFavorite);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(term));
    }

    return items;
  }, [allItems, searchTerm, showFavoritesOnly]);

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
