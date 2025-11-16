import { Request, Response, NextFunction } from "express";
import { FavoritesService } from "../services/favorites.service";
import { MongoFavoritesRepository } from "../repositories/favorites.mongo.repository";
import {
  AddFavoriteRequestBody,
  FavoritePokemonAttrs,
} from "../models/favorites.model";
import { parsePositiveInt } from "../utils/validation";

const favoritesRepo = new MongoFavoritesRepository();
const favoritesService = new FavoritesService(favoritesRepo);

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await favoritesService.getAllFavorites();
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as AddFavoriteRequestBody;
    const pokemonId = parsePositiveInt(body.pokemonId, "pokemonId");

    const favorite = await favoritesService.addFavorite(pokemonId);

    res.status(201).json({ success: true, data: favorite });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pokemonId = Number(req.params.pokemonId);
    if (Number.isNaN(pokemonId) || pokemonId <= 0) {
      return res.status(400).json({ message: "Invalid pokemon id" });
    }

    await favoritesService.removeFavorite(pokemonId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
