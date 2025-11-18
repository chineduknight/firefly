# Knight Pokémon – Firefly Assignment (Frontend)

A polished, interactive Pokémon Explorer built as part of the Firefly Full-Stack Engineer take-home assignment.
This project showcases clean architecture, strong UI/UX, **server-driven search + infinite scrolling**, React Query caching, accessibility-minded components, and a beautifully animated Pokémon details modal.

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
It provides a smooth browsing experience with large Pokémon cards, **server-driven pagination & search**, detailed modal views, and favorites management stored in MongoDB.

The application focuses on:

- Clean architecture
- Reusable hooks
- Component-driven UI
- Real-world engineering trade-offs
- Accessibility and UX polish
- Testability and maintainability

Built for **Firefly** as a senior-level demonstration of full-stack proficiency.

---

## ✨ Features

### Core Requirements

- View the first **150 Pokémon** (hard-capped in the backend)
- **Search by name (server-side)** via a `search` query param to the backend
- View detailed Pokémon info: types, abilities, evolution chain
- Add / remove favorites (persistent via backend)
- Display favorites directly in the list and details views
- Backend communication with React Query

### Bonus Enhancements

- **Server-driven infinite scrolling** using `offset`/`limit` and React Query’s `useInfiniteQuery`
- **Intersection Observer** sentinel for automatic “load more” while scrolling
- **Debounced search** so typing is instant while minimizing network calls
- **Animated modal transitions** using Framer Motion
- **Clickable evolution chips** that load other Pokémon in place, with animated transitions
- Large card-based UI with hover motion
- “Knight Pokémon” banner and polished theme
- Fully typed TypeScript API + domain models
- Favorites-only toggle that filters client-side on the loaded dataset
- **Keyboard-accessible cards & controls** (focus styles, Enter/Space support)
- **ARIA-labelled search & filters** for better screen reader support
- **Basic test coverage** with Vitest + React Testing Library

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

**Testing:**

- Vitest
- React Testing Library
- @testing-library/jest-dom

**Backend (consumed by this frontend):**

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
      FavoritesFilter.tsx
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
    useDebouncedValue.ts
  pages/
    Home.tsx
  types/
    pokemon.ts
    api.ts
  theme/
    index.ts
  test/
    setupTests.ts
    (component tests for filters, cards, search)
```

---

## ⚙️ Setup

### 1. Clone repo

```bash
git clone https://github.com/chineduknight/knight-firefly-pokemonapp
cd firefly-pokemon/frontend
```

(Adjust the path if this frontend lives inside a mono-repo.)

### 2. Install deps

```bash
yarn install
```

### 3. Run backend

The backend should be running at:

```text
http://localhost:4000/api
```

See the backend README for details.

### 4. Start frontend

```bash
yarn dev
```

Open:

```text
http://localhost:5173
```

### 5. Run tests (optional)

```bash
yarn test
```

---

## 🧠 Approach

- **Feature-based architecture** for clarity and scalability.
- **Reusable hooks** encapsulate business logic:
  - `usePokemonList` – server-driven infinite scroll (`offset`/`limit`, `hasNextPage`, backend `search`).
  - `usePokemonDetails` – Pokémon details + evolution chain.
  - `useFavoriteActions` – add/remove favorites with backend mutations + React Query invalidation.
  - `useUiState` – selected Pokémon, search term, favorites-only mode, dialog open/close.
  - `useDebouncedValue` – stabilizes search input before hitting the network.
- **React Query** manages caching, pagination, deduplication, and invalidation.
- **Chakra UI** provides accessible, responsive components with consistent design tokens.
- **Framer Motion** adds subtle motion for the details dialog and card hover states.
- **Clean Code principles**: separation of concerns, typed boundaries, consistent naming, and small composable components.
- **Accessibility-first details**:
  - Cards and favorite icons are focusable and operable via keyboard.
  - Search and filters are ARIA-labelled for assistive technologies.
- **Testability**:
  - Vitest + React Testing Library cover interactive pieces like the favorites filter, cards, and search bar.

Favorites are **canonical on the backend**:

- Frontend sends only the Pokémon ID when favoriting.
- Backend fetches canonical Pokémon data from PokeAPI and persists it in MongoDB.
- List and details endpoints mark each Pokémon with `isFavorite`, so the UI never has to manually stitch favorites.

---

## 🌟 Bonus Enhancements

- In-place evolution navigation inside the modal.
- Animated detail transitions when switching between Pokémon.
- Server-driven infinite scroll with `useInfiniteQuery` and `hasNextPage`.
- Debounced search for better UX and fewer API calls.
- Custom loader, error, and empty states for graceful feedback.
- Responsive, hover-enhanced card grid.
- Favorites-only view built as a **client-side filter** on the loaded dataset.
- Bundle analysis via `rollup-plugin-visualizer` `(yarn analyze)` to inspect and optimize build size (code-splitting, dependency impact).

---

## 🚧 Status

Production-ready version for the Firefly assignment.
Potential future improvements:

- PWA support and offline caching.
- Advanced search (e.g. filter by type or ability).
- More comprehensive test coverage (end-to-end tests with Playwright/Cypress).

---

## 👨🏾‍💻 Credits

Developed by **Chinedu Knight**
https://chineduknight.com

---

## 📄 License

MIT
