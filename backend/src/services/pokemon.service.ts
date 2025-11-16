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
  mapPokemonListResponse,
} from "../utils/pokeapiToDomain.mapper";
import { PokemonDetails, PokemonListResponse } from "../models/pokemon.types";
import { config } from "../config/env";

const MAX_POKEMON = config.maxPokemon;
interface GetPokemonListParams {
  offset: number;
  limit: number;
}
export class PokemonService {
  constructor(private readonly favoritesRepo: FavoritesRepository) {}

  async getPokemonList(
    params: GetPokemonListParams
  ): Promise<PokemonListResponse> {
    const { offset, limit } = params;

    const [apiList, favoriteIds] = await Promise.all([
      fetchPokemonList({ offset, limit }),
      this.favoritesRepo.getIds(),
    ]);

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
