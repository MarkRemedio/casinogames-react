import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { Game } from "../types";
import { fetchGames } from "../api/games";
import { fetchJackpots } from "../api/jackpot";


export const OTHER_CATEGORIES = ["ball", "virtual", "fun"] as const;
type OtherCategoryId = "other";

export interface Category {
  id: string | OtherCategoryId; // raw id from feed OR "other"
  label: string;
}

// Capitalise first letter helper
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// -------------------
// Store definitions
// -------------------
interface LobbyState {
  
  games: Game[];
  jackpots: Record<string, number>;
  categories: Category[];
  activeCategory: string | OtherCategoryId;
  loading: boolean;
  error: string | null;

  // ----- Actions -----
  loadGames: () => Promise<void>;
  loadJackpots: () => Promise<void>;
  startJackpotPolling: () => void;
  stopJackpotPolling: () => void;
  setActiveCategory: (id: string | OtherCategoryId) => void;
}

let jackpotInterval: ReturnType<typeof setInterval> | null = null;

export const useLobbyStore = create<LobbyState>()(
  devtools(
    persist(
      (set, get) => ({
        // ------------- Initial state -------------
        games: [],
        jackpots: {},
        categories: [],
        activeCategory: "all",
        loading: false,
        error: null,

        // ------------- Actions -------------
        loadGames: async () => {
          try {
            set({ loading: true, error: null });

            const games = await fetchGames();

            // --- Derive categories (with "Other") ---
            const rawIds = new Set<string>();
            games.forEach((g) => g.categories.forEach((id) => rawIds.add(id)));

            const derived: Category[] = [
              { id: "all", label: "All" },
              ...[...rawIds]
                .filter((id) => !OTHER_CATEGORIES.includes(id as any))
                .map((id) => ({ id, label: cap(id) })),
            ];

            derived.push({ id: "other", label: "Other" });

            const activeCategory = get().activeCategory;
            let filteredGames = games;
            if (activeCategory === "other") {
              filteredGames = games.filter((g) =>
                g.categories.some((c) => OTHER_CATEGORIES.includes(c as any))
              );
            } else if (activeCategory !== "all") {
              filteredGames = games.filter((g) => g.categories.includes(activeCategory));
            } else {
                filteredGames = games;
            }

            set({ games: filteredGames, categories: derived, loading: false });
          } catch (err: any) {
            set({ loading: false, error: err?.message ?? "Failed to load games" });
          }
        },

        loadJackpots: async () => {
          try {
            set({ jackpots: await fetchJackpots() });
          } catch (err) {
            console.warn("Jackpot fetch failed:", err);
          }
        },

        startJackpotPolling: () => {
          if (jackpotInterval) return; // already running
          get().loadJackpots();
          jackpotInterval = setInterval(get().loadJackpots, 5000);
        },

        stopJackpotPolling: () => {
          if (!jackpotInterval) return;
          clearInterval(jackpotInterval);
          jackpotInterval = null;
        },

        setActiveCategory: (id) => {
            set({ activeCategory: id });
            get().loadGames();
        }
      }),
      { name: "lobby-store" }
    )
  )
);
