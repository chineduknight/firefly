import { Request, Response, NextFunction } from "express";
import { PokemonService } from "../services/pokemon.service";
import { MongoFavoritesRepository } from "../repositories/favorites.mongo.repository";
import { config } from "../config/env";

const favoritesRepo = new MongoFavoritesRepository();
const pokemonService = new PokemonService(favoritesRepo);

const MAX_POKEMON = config.maxPokemon;
const DEFAULT_LIMIT = config.defaultLimit;

// This function ensures that query parameters are parsed correctly as numbers
const parseNumericQuery = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

export const getPokemonList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let offset = parseNumericQuery(req.query.offset) ?? 0;
    let limit = parseNumericQuery(req.query.limit) ?? DEFAULT_LIMIT;

    const rawSearch = (req.query.search as string | undefined) ?? "";
    const search = rawSearch.trim() || undefined;

    if (offset < 0) offset = 0;
    if (limit <= 0) limit = DEFAULT_LIMIT;

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

    const data = await pokemonService.getPokemonList({ offset, limit, search });

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    if (err instanceof Error && err.message.includes("circuit open")) {
      return res.status(503).json({
        success: false,
        message:
          "Upstream Pokémon provider is temporarily unavailable. Please try again shortly.",
      });
    }

    return next(err);
  }
};

export const getPokemonDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as unknown as number;

    const data = await pokemonService.getPokemonDetails(id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
