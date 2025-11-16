# Knight Pokémon – Firefly Assignment (Frontend)

A polished, interactive Pokémon Explorer built as part of the Firefly Full-Stack Engineer take-home assignment.
This project showcases clean architecture, strong UI/UX, React Query caching, server-driven infinite scrolling, and a beautifully animated Pokémon details modal.

## 🚀 Demo

Access my site at [Knight Pokémon App](https://knigt-firefly-pokeapp.netlify.app/).

## 📘 Table of Contents

- [About The App](#about-the-app)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Approach](#approach)
- [Bonus Enhancements](#bonus-enhancements)
- [Status](#status)
- [Credits](#credits)
- [License](#license)

---

## 🎯 About The App

Knight Pokémon is a modern web app that fetches Pokémon data from a custom backend connected to PokeAPI.
It provides a smooth browsing experience with large Pokémon cards, server-driven infinite scrolling, detailed modal views, and favorites management stored in MongoDB.

The application focuses on:

- Clean architecture
- Reusable hooks
- Component-driven UI
- Real-world engineering trade-offs
- Exceptional UX polish

Built for **Firefly** as a senior-level demonstration of full-stack proficiency.

---

## ✨ Features

### Core Requirements

- View the first **150 Pokémon** (hard-capped in the backend)
- Search by name
- View detailed Pokémon info: types, abilities, evolution chain
- Add / remove favorites (persistent via backend)
- Display favorites directly in the list and details views
- Backend communication with React Query

### Bonus Enhancements

- **Server-driven infinite scrolling** using `offset`/`limit` and React Query’s `useInfiniteQuery`
- **Intersection Observer** sentinel for automatic “load more” while scrolling
- **Animated modal transitions** using Framer Motion
- **Clickable evolution chips** that load other Pokémon in place, with animated transitions
- Large card-based UI with hover motion
- “Knight Pokémon” banner and polished theme
- Fully typed TypeScript API + domain models
- Unified API response envelope + robust error handling
- Favorites-only toggle that filters client-side on the loaded dataset

---

## 🖼️ Screenshots

![Knight Pokémon App 1](https://res.cloudinary.com/chineduknight/image/upload/v1763304417/samples/Screenshot_2025-11-16_at_3.46.39_PM_wqw2pr.png)
![Knight Pokémon App 2](https://res.cloudinary.com/chineduknight/image/upload/v1763304416/samples/Screenshot_2025-11-16_at_3.46.30_PM_jkhz9v.png)

---

## 🧰 Technologies

**Frontend:**

- React + Vite
- TypeScript
- Chakra UI
- React Query (`useInfiniteQuery` + `useQuery`)
- Axios
- Framer Motion

**Backend:**

- Node.js / Express
- TypeScript
- MongoDB + Mongoose
- PokeAPI

---

## 📂 Project Structure

```text
src/
  api/
    pokemonApi.ts
    favoritesApi.ts
  components/
    pokemon/
      PokemonCard.tsx
      PokemonList.tsx
      PokemonDetailsDialog.tsx
      SearchBar.tsx
      FavoritesToggle.tsx
      InfiniteScrollSentinel.tsx
    common/
      Loader.tsx
      ErrorState.tsx
      EmptyState.tsx
  hooks/
    usePokemonList.ts
    usePokemonDetails.ts
    useFavoriteActions.ts
    useUiState.ts
  pages/
    Home.tsx
  state/
    (UI state store, if applicable)
  types/
    pokemon.ts
    api.ts
  theme/
    index.ts
```

---

## ⚙️ Setup

### 1. Clone repo

```bash
git clone https://github.com/chineduknight/knight-firefly-pokemonapp
cd firefly-pokemon/frontend
```

### 2. Install deps

```bash
yarn install
```

### 3. Run backend

The backend should be running at:

```text
http://localhost:4000/api
```

### 4. Start frontend

```bash
yarn dev
```

Open:

```text
http://localhost:5173
```

---

## 🧠 Approach

- **Feature-based architecture** for clarity and scalability
- **Reusable hooks** encapsulate business logic:
  - `usePokemonList` – server-driven infinite scroll (`offset`/`limit`, `hasNextPage`)
  - `usePokemonDetails` – Pokémon details + evolution chain
  - `useFavoriteActions` – add/remove favorites with backend mutations
  - `useUiState` – selected Pokémon, search term, favorites-only toggle
- **React Query** handles caching, pagination, and invalidation
- **Chakra UI** provides accessible, responsive components
- **Framer Motion** adds micro-interactions and smooth modal transitions
- **Clean Code principles**: separation of concerns, typed boundaries, consistent naming, small composable components

Favorites are **canonical on the backend**:

- Frontend sends only the Pokémon ID when favoriting.
- Backend fetches canonical Pokémon data from PokeAPI and persists it in MongoDB.
- List and details endpoints mark each Pokémon with `isFavorite`, so the UI never has to manually stitch favorites.

---

## 🌟 Bonus Enhancements

- In-place evolution navigation inside the modal
- Animated detail transitions when switching between Pokémon
- Server-driven infinite scroll with `useInfiniteQuery` and `hasNextPage`
- Custom loader, error states, and empty states for better UX
- Responsive, hover-enhanced card grid
- Favorites-only view built as a **client-side filter** on the loaded dataset (no unnecessary network calls)

---

## 🚧 Status

Production-ready version for the Firefly assignment.
Further improvements could include PWA support, offline caching, and advanced search (e.g. by type or ability).

---

## 👨🏾‍💻 Credits

Developed by **Chinedu Knight**
https://chineduknight.com

---

## 📄 License

MIT
