import {
  PokemonDetails,
  PokemonEvolution,
  PokemonListItem,
  PokemonListResponse,
} from "../models/pokemon.types";
import {
  PokeApiListResponse,
  PokeApiPokemonResponse,
  PokeApiEvolutionChainResponse,
  EvolutionChainLink,
} from "../clients/pokeapi.client";

export const buildSpriteUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
interface MapPokemonListOptions {
  offset: number;
  limit: number;
  maxTotal: number;
}
export const mapPokemonListResponse = (
  apiResponse: PokeApiListResponse,
  favoriteIds: number[],
  options: MapPokemonListOptions
): PokemonListResponse => {
  const { offset, limit, maxTotal } = options;
  const total = Math.min(apiResponse.count, maxTotal);

  const items = apiResponse.results.map((item) => {
    const id = extractIdFromUrl(item.url);
    return {
      id,
      name: item.name,
      spriteUrl: buildSpriteUrl(id),
      isFavorite: favoriteIds.includes(id),
    };
  });
  const hasNextPage = offset + limit < total;
  const nextOffset = hasNextPage ? offset + limit : null;

  return {
    items,
    total,
    page: {
      offset,
      limit,
      hasNextPage,
      nextOffset,
    },
  };
};

export const mapPokemonDetails = (
  apiPokemon: PokeApiPokemonResponse,
  evolutions: PokemonEvolution[],
  isFavorite: boolean
): PokemonDetails => {
  const spriteFromOfficial =
    apiPokemon.sprites.other?.["official-artwork"]?.front_default;

  const spriteUrl =
    spriteFromOfficial ?? apiPokemon.sprites.front_default ?? "";

  return {
    id: apiPokemon.id,
    name: apiPokemon.name,
    spriteUrl,
    types: apiPokemon.types.map((t) => t.type.name),
    abilities: apiPokemon.abilities.map((a) => a.ability.name),
    isFavorite,
    evolutions,
  };
};

export const mapEvolutionChain = (
  evolutionChain: PokeApiEvolutionChainResponse
): PokemonEvolution[] => {
  const result: PokemonEvolution[] = [];

  const visitNode = (node: EvolutionChainLink) => {
    const { name, url } = node.species;

    const id = extractIdFromUrl(url);
    result.push({ id, name });

    // Recurse into all evolution branches
    node.evolves_to.forEach(visitNode);
  };

  visitNode(evolutionChain.chain);

  const unique = new Map<number, PokemonEvolution>();
  for (const evo of result) {
    if (!unique.has(evo.id)) {
      unique.set(evo.id, evo);
    }
  }

  return Array.from(unique.values());
};

export const extractIdFromUrl = (url: string): number => {
  const segments = url.split("/").filter(Boolean);
  const idSegment = segments[segments.length - 1];
  return Number(idSegment);
};
