import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  POKEAPI_BASE_URL: z.url().default("https://pokeapi.co/api/v2"),
  MAX_POKEMON: z.coerce.number().default(150),
  DEFAULT_LIMIT: z.coerce.number().default(30),
});

const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  pokeApiBaseUrl: env.POKEAPI_BASE_URL,
  maxPokemon: env.MAX_POKEMON,
  defaultLimit: env.DEFAULT_LIMIT,
};
