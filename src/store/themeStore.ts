import { create } from "zustand";
import { db } from "../storage/db";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  hydrated: boolean;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  hydrate: () => Promise<void>;
}

const KEY = "theme";

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  hydrated: false,

  setTheme: (theme) => {
    set({ theme });
    db.kv.put({ key: KEY, value: theme });
    applyTheme(theme);
  },

  toggle: () => {
    const next = get().theme === "light" ? "dark" : "light";
    get().setTheme(next);
  },

  hydrate: async () => {
    const row = await db.kv.get(KEY);
    const saved: Theme = row?.value === "dark" ? "dark" : "light";
    set({ theme: saved, hydrated: true });
    applyTheme(saved);
  },
}));

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}