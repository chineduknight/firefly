import { Request, Response, NextFunction } from "express";
import { PokemonService } from "../services/pokemon.service";
import { MongoFavoritesRepository } from "../repositories/favorites.mongo.repository";
import { config } from "../config/env";

const favoritesRepo = new MongoFavoritesRepository();
const pokemonService = new PokemonService(favoritesRepo);

const MAX_POKEMON = config.maxPokemon;
const DEFAULT_LIMIT = config.defaultLimit;
export const getPokemonList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const offsetParam = req.query.offset as string | undefined;
    const limitParam = req.query.limit as string | undefined;

    let offset = offsetParam ? Number(offsetParam) : 0;
    let limit = limitParam ? Number(limitParam) : DEFAULT_LIMIT;

    if (!Number.isFinite(offset) || offset < 0) {
      offset = 0;
    }

    if (!Number.isFinite(limit) || limit <= 0) {
      limit = DEFAULT_LIMIT;
    }

    if (offset >= MAX_POKEMON) {
      return res.json({
        success: true,
        data: {
          items: [],
          total: MAX_POKEMON,
          page: {
            offset,
            limit: 0,
            hasNextPage: false,
            nextOffset: null,
          },
        },
      });
    }

    if (offset + limit > MAX_POKEMON) {
      limit = MAX_POKEMON - offset;
    }

    const data = await pokemonService.getPokemonList({ offset, limit });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPokemonDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid pokemon id" });
    }

    const data = await pokemonService.getPokemonDetails(id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
