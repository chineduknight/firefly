import { Schema, model, Document } from "mongoose";
export interface AddFavoriteRequestBody {
  pokemonId: number;
}

export interface FavoritePokemonAttrs {
  pokemonId: number;
  name: string;
  spriteUrl: string;
  types: string[];
}

export interface FavoritePokemonDoc extends FavoritePokemonAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoritePokemon extends FavoritePokemonAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const favoritePokemonSchema = new Schema<FavoritePokemonDoc>(
  {
    pokemonId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    spriteUrl: { type: String, required: true },
    types: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

favoritePokemonSchema.index({ pokemonId: 1 }, { unique: true });

export const FavoritePokemonModel = model<FavoritePokemonDoc>(
  "FavoritePokemon",
  favoritePokemonSchema
);
