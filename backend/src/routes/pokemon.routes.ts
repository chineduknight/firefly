import { Router } from "express";
import {
  getPokemonList,
  getPokemonDetails,
} from "../controllers/pokemon.controller";
import { z } from "zod";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();
const pokemonListQuerySchema = z.object({
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().trim().min(1).max(50).optional(),
});

const pokemonIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

router.get(
  "/",
  validateRequest({ query: pokemonListQuerySchema }),
  getPokemonList
);
router.get(
  "/:id",
  validateRequest({ params: pokemonIdParamsSchema }),
  getPokemonDetails
);

export default router;
