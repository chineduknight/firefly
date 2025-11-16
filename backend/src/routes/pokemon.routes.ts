import { Router } from "express";
import {
  getPokemonList,
  getPokemonDetails,
} from "../controllers/pokemon.controller";

const router = Router();

router.get("/", getPokemonList);
router.get("/:id", getPokemonDetails);

export default router;
