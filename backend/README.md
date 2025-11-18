# Firefly Pokédex – Backend (Knight)

A Node.js + TypeScript backend serving as an API layer between the frontend and PokéAPI.
It implements Pokémon listing with server‑driven pagination and search, detailed Pokémon data (including evolution chains), and a MongoDB‑backed favorites system using clean architecture principles.

---

## 🚀 Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **HTTP Client:** Axios
- **Validation:** Zod
- **Security:** Helmet, express-rate-limit
- **Architecture:** Controllers → Services → Repositories → Clients → Models → Utils

---

## 🏗️ Architecture Overview

```text
src/
  app.ts
  config/
    env.ts
  controllers/
    pokemon.controller.ts
    favorites.controller.ts
  services/
    pokemon.service.ts
  repositories/
    favorites.mongo.repository.ts
  clients/
    pokeapi.client.ts
  models/
    favorites.model.ts
    pokemon.types.ts
  routes/
    pokemon.routes.ts
    favorites.routes.ts
  middleware/
    validateRequest.ts
    errorHandler.ts
  utils/
    cache.ts
    resilience.ts
```

### Key Architecture Decisions

- **Repository pattern** for persistence abstraction (MongoDB is an implementation detail).
- **Domain models** independent of raw PokéAPI JSON.
- **Centralized error handling** and unified API envelope for success/error.
- **Server‑driven pagination** using `offset`/`limit` with a hard cap of 150 Pokémon.
- **Recursive evolution chain parsing** with multi‑branch support.
- **Request validation layer** using Zod + middleware for params, query, and body.
- **PokeAPI client** wrapped with in‑memory caching + retry & circuit‑breaker helper.

---

## 🏃 Running the Backend

From the backend folder:

```bash
yarn install
yarn dev
```

The API will run by default at:

```text
http://localhost:4000/api
```

You can also build & run in production mode:

```bash
yarn build
yarn start
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### `GET /api/pokemon?offset=0&limit=30&search=term`

Returns a paginated list of Pokémon (up to the first 150). Supports server‑side search by name.

- **Query params:**

  - `offset` (optional, default `0`) – zero‑based index into the result set.
  - `limit` (optional, default `30`) – page size; clamped so `offset + limit ≤ 150`.
  - `search` (optional) – case‑insensitive substring match on Pokémon name.

- **Response shape:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 25,
        "name": "pikachu",
        "spriteUrl": "https://...",
        "isFavorite": true
      }
    ],
    "total": 42,
    "page": {
      "offset": 0,
      "limit": 30,
      "hasNextPage": true,
      "nextOffset": 30
    }
  }
}
```

> `total` reflects the number of results **after** applying the search filter (not always 150).

---

### `GET /api/pokemon/:id`

Returns full Pokémon details, including types, abilities, evolution chain, and favorite status.

- **Params:**

  - `id` – positive integer Pokémon ID (validated).

- **Response shape (simplified):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "bulbasaur",
    "spriteUrl": "https://...",
    "isFavorite": false,
    "types": ["grass", "poison"],
    "abilities": ["overgrow", "chlorophyll"],
    "evolutions": [
      { "id": 1, "name": "bulbasaur" },
      { "id": 2, "name": "ivysaur" },
      { "id": 3, "name": "venusaur" }
    ]
  }
}
```

---

### `GET /api/favorites`

Returns all favorite Pokémon persisted in MongoDB.

```json
{
  "success": true,
  "data": [
    {
      "pokemonId": 25,
      "name": "pikachu",
      "spriteUrl": "https://...",
      "types": ["electric"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### `POST /api/favorites`

Adds a Pokémon to favorites.
The backend fetches canonical data from PokéAPI based on the provided `pokemonId` and stores a normalized document in MongoDB.

- **Body:**

```json
{
  "pokemonId": 25
}
```

- **Response (simplified):**

```json
{
  "success": true,
  "data": {
    "pokemonId": 25,
    "name": "pikachu",
    "spriteUrl": "https://...",
    "types": ["electric"]
  }
}
```

Validation ensures the ID is a positive integer and within the supported range.

---

### `DELETE /api/favorites/:id`

Removes a Pokémon from favorites.

- Returns `204 No Content` on success.
- Returns `404` if the favorite does not exist.
- Validates that `id` is a positive integer.

---

## 🧠 Evolution Parsing

The evolution chain is fetched via Pokémon species → evolution chain URL and parsed **recursively** into a flat ordered list.
Multi‑branch chains are supported; for example:

```json
[
  { "id": 1, "name": "bulbasaur" },
  { "id": 2, "name": "ivysaur" },
  { "id": 3, "name": "venusaur" }
]
```

This representation is simple for the frontend to render while preserving evolution order.

---

## 🔒 Validation, Security & Error Handling

### Validation

- All request **params**, **query**, and **body** are validated with **Zod** via a reusable `validateRequest` middleware.
- Examples:
  - `offset`/`limit` must be numeric and are clamped to safe ranges.
  - `id` and `pokemonId` must be positive integers.
  - Invalid inputs return a structured `400` response:

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      /* Zod error details */
    ]
  }
}
```

### Security

- `helmet()` for sensible HTTP security headers.
- `express.json({ limit: "1mb" })` to guard against excessively large payloads.
- `express-rate-limit` on `/api` to protect against brute force / abuse (e.g. 100 requests / 15 min per IP).
- In production:
  - `app.set("trust proxy", 1)` for reverse proxies (Render/Heroku/etc.).
  - Optional HTTP → HTTPS redirect when running behind a proxy.

### Error Handling

- Centralized error handler normalizes thrown errors into a consistent JSON shape.
- Axios upstream errors (from PokéAPI) are wrapped into HTTP‑aware errors with appropriate status codes.
- Unknown errors fall back to `500` with a generic message while logging details server‑side.

---

## 🌐 PokéAPI Integration, Caching & Resilience

### Caching

- PokeAPI calls are wrapped with a small cache abstraction:
  - In‑memory implementation (`InMemoryCache`) with TTL (e.g. 5 minutes).
  - Cached items:
    - Pokémon list pages (`offset`/`limit`)
    - Pokémon details (`/pokemon/:id`)
    - Species (`/pokemon-species/:id`)
    - Evolution chains (`evolution_chain` URLs)
- The cache is defined behind a `Cache` interface, making it trivial to swap in Redis or another external store in a real production environment.

### Resilience (Retry + Circuit‑Breaker)

- All PokeAPI calls go through a `withPokeApiResilience` helper that:
  - Retries transient network / 5xx errors with exponential backoff.
  - Tracks failures and **opens a simple circuit breaker** after repeated failures.
  - While the circuit is open, calls fail fast with a clear “temporarily unavailable” error.
- Combined with caching, this:
  - Reduces load on PokeAPI.
  - Avoids cascading failures when the upstream API is unstable.

---

## 🗄️ MongoDB Persistence

Favorites are stored in a dedicated collection with a normalized schema:

```ts
pokemonId: number;
name: string;
spriteUrl: string;
types: string[];
createdAt: Date;
updatedAt: Date;
```

- The backend fetches authoritative data from PokeAPI when a favorite is added.
- The favorites repository abstracts MongoDB, making it easy to replace the storage backend in the future.

---

## ⚙️ Environment Variables

Environment configuration is **validated with Zod** in `config/env.ts`.

Create `.env` in the backend root (or use `.env.example` as a template):

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/firefly_pokedex
POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

Invalid or missing variables cause the app to fail fast on startup with a clear error.

---

## 🧪 Testing

A lightweight Jest + Supertest setup is included:

- Integration tests for:
  - `GET /api/pokemon` (shape, pagination metadata).
  - `GET /api/pokemon/:id` validation for invalid IDs.
  - `POST /api/favorites` and `DELETE /api/favorites/:id` input validation.

Run tests with:

```bash
yarn test
```

Additional tests can be added easily as the service grows.

---

## 🧪 Manual Testing (cURL)

### List Pokémon (first page)

```bash
curl "http://localhost:4000/api/pokemon?offset=0&limit=30"
```

### Search Pokémon by name

```bash
curl "http://localhost:4000/api/pokemon?offset=0&limit=30&search=pika"
```

### Pokémon details

```bash
curl "http://localhost:4000/api/pokemon/1"
```

### Add favorite

```bash
curl -X POST "http://localhost:4000/api/favorites"   -H "Content-Type: application/json"   -d '{"pokemonId": 25}'
```

### Remove favorite

```bash
curl -X DELETE "http://localhost:4000/api/favorites/25"
```

---

## 💡 Future Improvements

The backend is production‑ready for the purposes of this assignment, but potential extensions include:

- Moving cache implementation from in‑memory to **Redis** or another external store.
- Extending search to support filtering by type/ability and combining multiple criteria.
- Authentication & multi‑user favorites (per user instead of global collection).
- More extensive test coverage (unit tests around services/repositories).

---

This backend is designed to pair with the **Knight Pokémon – Firefly Assignment (Frontend)**, which consumes these endpoints for an infinite‑scroll Pokémon explorer with favorites and rich details.
