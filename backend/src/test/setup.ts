process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
process.env.PORT = process.env.PORT ?? "4000";
process.env.MONGO_URI =
  process.env.MONGO_URI ?? "mongodb://localhost:27017/test";
process.env.POKEAPI_BASE_URL =
  process.env.POKEAPI_BASE_URL ?? "https://pokeapi.co/api/v2";
process.env.MAX_POKEMON = process.env.MAX_POKEMON ?? "150";
process.env.DEFAULT_LIMIT = process.env.DEFAULT_LIMIT ?? "30";

export {};
