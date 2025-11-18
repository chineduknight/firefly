import { FavoritesRepository } from "../repositories/favorites.repository";
import {
  fetchEvolutionChain,
  fetchPokemonDetails,
  fetchPokemonList,
  fetchPokemonSpecies,
} from "../clients/pokeapi.client";
import {
  mapEvolutionChain,
  mapPokemonDetails,
  mapPokemonListItems,
  mapPokemonListResponse,
} from "../utils/pokeapiToDomain.mapper";
import { PokemonDetails, PokemonListResponse } from "../models/pokemon.types";
import { config } from "../config/env";

const MAX_POKEMON = config.maxPokemon;
interface GetPokemonListParams {
  offset: number;
  limit: number;
  search?: string;
}
export class PokemonService {
  constructor(private readonly favoritesRepo: FavoritesRepository) {}

  async getPokemonList(
    params: GetPokemonListParams
  ): Promise<PokemonListResponse> {
    const { offset, limit, search } = params;

    const favoriteIds = await this.favoritesRepo.getIds();

    if (search) {
      const apiList = await fetchPokemonList({ offset: 0, limit: MAX_POKEMON });

      const allItems = mapPokemonListItems(apiList, favoriteIds); // returns PokemonListItem[]

      const term = search.toLowerCase();
      const filtered = allItems.filter((item) =>
        item.name.toLowerCase().includes(term)
      );

      const total = filtered.length;

      const pagedItems = filtered.slice(offset, offset + limit);

      const hasNextPage = offset + limit < total;
      const nextOffset = hasNextPage ? offset + limit : null;

      return {
        items: pagedItems,
        total,
        page: {
          offset,
          limit,
          hasNextPage,
          nextOffset,
        },
      };
    }

    const apiList = await fetchPokemonList({ offset, limit });

    return mapPokemonListResponse(apiList, favoriteIds, {
      offset,
      limit,
      maxTotal: MAX_POKEMON,
    });
  }

  async getPokemonDetails(id: number): Promise<PokemonDetails> {
    const [apiPokemon, species, isFavorite] = await Promise.all([
      fetchPokemonDetails(id),
      fetchPokemonSpecies(id),
      this.favoritesRepo.isFavorite(id),
    ]);

    const evolutionChainResponse = await fetchEvolutionChain(
      species.evolution_chain.url
    );

    const evolutions = mapEvolutionChain(evolutionChainResponse);

    return mapPokemonDetails(apiPokemon, evolutions, isFavorite);
  }
}
