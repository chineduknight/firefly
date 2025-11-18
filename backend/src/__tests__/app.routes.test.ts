/// <reference types="@types/jest" />
import type { Express } from "express";
import { createApp } from "../app";
import type {
  PokemonDetails,
  PokemonListResponse,
} from "../models/pokemon.types";
import type { FavoritePokemon } from "../models/favorites.model";
import { performRequest } from "../test/httpTestClient";

type PokemonServiceMock = {
  getPokemonList: jest.Mock;
  getPokemonDetails: jest.Mock;
};

jest.mock("../services/pokemon.service", () => {
  const mockPokemonService: PokemonServiceMock = {
    getPokemonList: jest.fn(),
    getPokemonDetails: jest.fn(),
  };

  return {
    PokemonService: jest.fn().mockImplementation(() => mockPokemonService),
    __mockPokemonService: mockPokemonService,
  };
});

type FavoritesServiceMock = {
  getAllFavorites: jest.Mock;
  addFavorite: jest.Mock;
  removeFavorite: jest.Mock;
};

jest.mock("../services/favorites.service", () => {
  const mockFavoritesService: FavoritesServiceMock = {
    getAllFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  };

  return {
    FavoritesService: jest.fn().mockImplementation(() => mockFavoritesService),
    __mockFavoritesService: mockFavoritesService,
  };
});

const { __mockPokemonService } = jest.requireMock(
  "../services/pokemon.service"
) as { __mockPokemonService: PokemonServiceMock };
const mockPokemonService = __mockPokemonService;

const { __mockFavoritesService } = jest.requireMock(
  "../services/favorites.service"
) as { __mockFavoritesService: FavoritesServiceMock };
const mockFavoritesService = __mockFavoritesService;

describe("API routes", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("responds to /health", async () => {
    const res = await performRequest(app, {
      method: "GET",
      path: "/health",
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  describe("GET /api/pokemon", () => {
    it("returns a paginated list from the Pokemon service", async () => {
      const listResponse: PokemonListResponse = {
        items: [
          {
            id: 1,
            name: "bulbasaur",
            spriteUrl: "http://example.com/1.png",
            isFavorite: false,
          },
        ],
        total: 1,
        page: {
          offset: 5,
          limit: 10,
          hasNextPage: false,
          nextOffset: null,
        },
      };
      mockPokemonService.getPokemonList.mockResolvedValue(listResponse);

      const res = await performRequest(app, {
        method: "GET",
        path: "/api/pokemon",
        query: { offset: "5", limit: "10" },
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, data: listResponse });
      expect(mockPokemonService.getPokemonList).toHaveBeenCalledWith({
        offset: 5,
        limit: 10,
        search: undefined,
      });
    });

    it("passes a trimmed search term to the service", async () => {
      const listResponse: PokemonListResponse = {
        items: [],
        total: 0,
        page: {
          offset: 0,
          limit: 30,
          hasNextPage: false,
          nextOffset: null,
        },
      };
      mockPokemonService.getPokemonList.mockResolvedValue(listResponse);

      const res = await performRequest(app, {
        method: "GET",
        path: "/api/pokemon",
        query: { search: " Pikachu " },
      });

      expect(res.status).toBe(200);
      expect(mockPokemonService.getPokemonList).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Pikachu" })
      );
    });

    it("rejects invalid query parameters", async () => {
      const res = await performRequest(app, {
        method: "GET",
        path: "/api/pokemon",
        query: { offset: "not-a-number" },
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toBe("Validation failed");
      expect(mockPokemonService.getPokemonList).not.toHaveBeenCalled();
    });
  });

  describe("GET /api/pokemon/:id", () => {
    it("returns Pokemon details", async () => {
      const details: PokemonDetails = {
        id: 25,
        name: "pikachu",
        spriteUrl: "http://example.com/pikachu.png",
        types: ["electric"],
        abilities: ["static"],
        evolutions: [],
        isFavorite: true,
      };
      mockPokemonService.getPokemonDetails.mockResolvedValue(details);

      const res = await performRequest(app, {
        method: "GET",
        path: "/api/pokemon/25",
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, data: details });
      expect(mockPokemonService.getPokemonDetails).toHaveBeenCalledWith(25);
    });
  });

  describe("Favorites routes", () => {
    it("lists favorites", async () => {
      const favorites: FavoritePokemon[] = [
        {
          pokemonId: 1,
          name: "bulbasaur",
          spriteUrl: "http://example.com/1.png",
          types: ["grass"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockFavoritesService.getAllFavorites.mockResolvedValue(favorites);

      const res = await performRequest(app, {
        method: "GET",
        path: "/api/favorites",
      });

      expect(res.status).toBe(200);
      const serializedFavorites = favorites.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      }));
      expect(res.body).toEqual({ items: serializedFavorites });
      expect(mockFavoritesService.getAllFavorites).toHaveBeenCalledTimes(1);
    });

    it("adds a favorite pokemon", async () => {
      const favorite: FavoritePokemon = {
        pokemonId: 7,
        name: "squirtle",
        spriteUrl: "http://example.com/7.png",
        types: ["water"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockFavoritesService.addFavorite.mockResolvedValue(favorite);

      const res = await performRequest(app, {
        method: "POST",
        path: "/api/favorites",
        body: { pokemonId: 7 },
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        success: true,
        data: {
          ...favorite,
          createdAt: favorite.createdAt.toISOString(),
          updatedAt: favorite.updatedAt.toISOString(),
        },
      });
      expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(7);
    });

    it("validates the favorite payload", async () => {
      const res = await performRequest(app, {
        method: "POST",
        path: "/api/favorites",
        body: { pokemonId: "invalid" },
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error?.message).toBe("Validation failed");
      expect(mockFavoritesService.addFavorite).not.toHaveBeenCalled();
    });

    it("removes a favorite pokemon", async () => {
      mockFavoritesService.removeFavorite.mockResolvedValue(undefined);

      const res = await performRequest(app, {
        method: "DELETE",
        path: "/api/favorites/12",
      });

      expect(res.status).toBe(204);
      expect(mockFavoritesService.removeFavorite).toHaveBeenCalledWith(12);
    });
  });
});
