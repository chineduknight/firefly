import { fetchPokemonDetails } from "../clients/pokeapi.client";
import {
  FavoritePokemon,
  FavoritePokemonAttrs,
  FavoritePokemonDoc,
} from "../models/favorites.model";
import { FavoritesRepository } from "../repositories/favorites.repository";
import { HttpError } from "../utils/httpError";

const MAX_POKEMON_ID = 150;

const mapFavoriteDocToDomain = (doc: FavoritePokemonDoc): FavoritePokemon => ({
  pokemonId: doc.pokemonId,
  name: doc.name,
  spriteUrl: doc.spriteUrl,
  types: doc.types,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});
export class FavoritesService {
  constructor(private readonly favoritesRepo: FavoritesRepository) {}

  getAllFavorites(): Promise<FavoritePokemon[]> {
    return this.favoritesRepo.getAll();
  }

  async addFavorite(pokemonId: number): Promise<FavoritePokemon> {
    if (pokemonId < 1 || pokemonId > MAX_POKEMON_ID) {
      throw new HttpError(
        400,
        `Only Pokémon IDs 1–${MAX_POKEMON_ID} can be favorited`
      );
    }

    const existing = await this.favoritesRepo.findByPokemonId(pokemonId);
    if (existing) {
      return mapFavoriteDocToDomain(existing as FavoritePokemonDoc);
    }

    const apiPokemon = await fetchPokemonDetails(pokemonId);

    const name = apiPokemon.name;
    const spriteUrl =
      apiPokemon.sprites.other?.["official-artwork"]?.front_default ??
      apiPokemon.sprites.front_default ??
      "";

    if (!spriteUrl) {
      throw new HttpError(
        502,
        "Could not determine a sprite URL for this Pokémon"
      );
    }

    const types = apiPokemon.types.map((t) => t.type.name);

    const attrs: FavoritePokemonAttrs = {
      pokemonId,
      name,
      spriteUrl,
      types,
    };

    const created = await this.favoritesRepo.createFavorite(attrs);
    return mapFavoriteDocToDomain(created as FavoritePokemonDoc);
  }

  removeFavorite(pokemonId: number): Promise<void> {
    return this.favoritesRepo.removeFavorite(pokemonId);
  }
}
