import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorites.controller";
import z from "zod";
import { validateRequest } from "../middlewares/validateRequest";

const router = Router();
const addFavoriteBodySchema = z.object({
  pokemonId: z.number().int().positive(),
});

const favoriteIdParamsSchema = z.object({
  pokemonId: z.string().regex(/^\d+$/).transform(Number),
});

router.get("/", getFavorites);
router.post("/", validateRequest({ body: addFavoriteBodySchema }), addFavorite);
router.delete(
  "/:pokemonId",
  validateRequest({ params: favoriteIdParamsSchema }),
  removeFavorite
);

export default router;
