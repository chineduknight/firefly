# Firefly Pokédex – Backend Knight

A Node.js + TypeScript backend serving as an API layer between the frontend and PokéAPI.
Implements Pokémon listing, detailed Pokémon data, and a MongoDB-backed favorites system
using clean architecture principles.

## 🚀 Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Axios
- Clean layered architecture (controllers, services, repositories, clients, models)

## 🏗️ Architecture Overview

```
src/
  config/
  controllers/
  services/
  repositories/
  clients/
  models/
  routes/
  middlewares/
  utils/
```

### Key Architecture Decisions

- Repository pattern for persistence abstraction
- Domain models independent of raw PokéAPI JSON
- Centralized error handling
- Consistent API response envelope
- Recursive evolution chain parsing with multi-branch support

## ⚙️ Environment Variables

Create a `.env` file from `.env.example`:

## 🏃 Running the Backend

```
yarn install
yarn dev
```

## 🔌 API Endpoints

### GET /api/pokemon?limit=150

Returns the first batch of Pokémon including favorite status.

### GET /api/pokemon/:id

Returns full Pokémon details including evolution chain.

### GET /api/favorites

Returns all favorites.

### POST /api/favorites

Adds a Pokémon to favorites.

### DELETE /api/favorites/:pokemonId

Deletes a Pokémon from favorites (404 if not found).

## 🧠 Evolution Parsing

Evolution chain is parsed recursively into a flat ordered list:

```
[
  { "id": 1, "name": "bulbasaur" },
  { "id": 2, "name": "ivysaur" },
  { "id": 3, "name": "venusaur" }
]
```

## 🔒 Validation & Error Handling

- Validates IDs, payloads, and JSON
- Normalizes axios upstream errors into HttpError
- Limits large inputs (e.g. `limit`)
- Unified success/error payload format

## 🗄️ MongoDB Persistence

Favorites stored as:

```
pokemonId: number
name: string
spriteUrl: string
types: string[]
createdAt / updatedAt
```

## 🧪 Manual Testing

### List Pokémon

```
curl http://localhost:4000/api/pokemon
```

### Pokémon details

```
curl http://localhost:4000/api/pokemon/1
```

### Add favorite

```
curl -X POST http://localhost:4000/api/favorites -H "Content-Type: application/json"   -d '{"pokemonId":25,"name":"pikachu","spriteUrl":"...","types":["electric"]}'
```

### Remove favorite

```
curl -X DELETE http://localhost:4000/api/favorites/25
```

## 💡 Future Improvements

- Caching (Redis)
- Rate limiting
- Full test suite
- Advanced evolution views
- Alternative storage backends

See you in the frontend
Check it out on this link
[Github Pokémon App](https://github.com/chineduknightknight-firefly-pokemonapp)

Access my site at [Knight Pokémon App](https://knigt-firefly-pokeapp.netlify.app/).
