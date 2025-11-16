import {
  FavoritePokemon,
  FavoritePokemonAttrs,
  FavoritePokemonDoc,
  FavoritePokemonModel,
} from "../models/favorites.model";
import { FavoritesRepository } from "./favorites.repository";

export class MongoFavoritesRepository implements FavoritesRepository {
  async getAll(): Promise<FavoritePokemon[]> {
    const docs = await FavoritePokemonModel.find().lean();
    return docs.map((doc) => ({
      pokemonId: doc.pokemonId,
      name: doc.name,
      spriteUrl: doc.spriteUrl,
      types: doc.types,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }
  async createFavorite(
    attrs: FavoritePokemonAttrs
  ): Promise<FavoritePokemonDoc> {
    const favorite = new FavoritePokemonModel(attrs);
    await favorite.save();
    return favorite;
  }
  async getIds(): Promise<number[]> {
    const docs = await FavoritePokemonModel.find({}, { pokemonId: 1 }).lean();
    return docs.map((doc) => doc.pokemonId);
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    const count = await FavoritePokemonModel.countDocuments({ pokemonId });
    return count > 0;
  }
  async findByPokemonId(pokemonId: number): Promise<FavoritePokemonDoc | null> {
    return FavoritePokemonModel.findOne({ pokemonId }).exec();
  }

  async addFavorite(attrs: FavoritePokemonAttrs): Promise<FavoritePokemon> {
    const doc = await FavoritePokemonModel.findOneAndUpdate(
      { pokemonId: attrs.pokemonId },
      attrs,
      { new: true, upsert: true }
    ).lean();

    if (!doc) {
      throw new Error("Failed to create or update favorite pokemon");
    }

    return {
      pokemonId: doc.pokemonId,
      name: doc.name,
      spriteUrl: doc.spriteUrl,
      types: doc.types,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async removeFavorite(pokemonId: number): Promise<void> {
    await FavoritePokemonModel.deleteOne({ pokemonId });
  }
}
