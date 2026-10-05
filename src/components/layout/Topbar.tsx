import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Flame, Target, Menu, Moon, Sun } from "lucide-react";
import { MobileDrawer } from "./MobileDrawer";
import { useThemeStore } from "../../store/themeStore";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/practice": "Practice",
  "/review": "Review",
  "/settings": "Settings",
};

export function Topbar() {
  const { pathname } = useLocation();
  const title = titleMap[pathname] ?? "NQT Prep";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="tabular-nums font-medium">0</span>
            <span className="text-slate-400 dark:text-slate-500">day streak</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Target className="h-4 w-4 text-indigo-500" />
            <span className="tabular-nums font-medium">0%</span>
            <span className="text-slate-400 dark:text-slate-500">accuracy</span>
          </div>

          {/* Compact chips on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span className="tabular-nums font-medium">0</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Target className="h-3.5 w-3.5 text-indigo-500" />
              <span className="tabular-nums font-medium">0%</span>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark" : "Switch to light"}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}