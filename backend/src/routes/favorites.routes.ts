import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorites.controller";

const router = Router();

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:pokemonId", removeFavorite);

export default router;
