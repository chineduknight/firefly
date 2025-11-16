import { Router } from "express";
import pokemonRoutes from "./pokemon.routes";
import favoritesRoutes from "./favorites.routes";

const router = Router();

router.use("/pokemon", pokemonRoutes);
router.use("/favorites", favoritesRoutes);

export default router;
