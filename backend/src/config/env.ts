import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined || value === null || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const config = {
  port: Number(getEnv("PORT", "4000")),
  mongoUri: getEnv("MONGO_URI", "mongodb://localhost:27017/firefly_pokedex"),
  pokeApiBaseUrl: getEnv("POKEAPI_BASE_URL", "https://pokeapi.co/api/v2"),
  maxPokemon: Number(getEnv("MAX_POKEMON")),
  defaultLimit: Number(getEnv("DEFAULT_LIMIT")),
};
