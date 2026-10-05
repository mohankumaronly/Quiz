import { useState } from "react";
import { Trash2, AlertTriangle, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  clearAllAnswers,
  clearAllSessions,
  resetAllProgress,
} from "../storage/progressRepo";
import { clearAllBookmarks } from "../storage/bookmarkRepo";
import { clearNotepad } from "../storage/notepadRepo";
import { db } from "../storage/db";
import { useThemeStore } from "../store/themeStore";

export default function Settings() {
  const [busy, setBusy] = useState(false);

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const run = async (label: string, fn: () => Promise<void>) => {
    if (!confirm(`${label}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fn();
      alert(`${label} — done.`);
    } finally {
      setBusy(false);
    }
  };

  const resetEverything = async () => {
    if (!confirm("Reset EVERYTHING? Progress, sessions, bookmarks, notepad."))
      return;
    setBusy(true);
    try {
      await resetAllProgress();
      await clearNotepad();
      await db.bookmarks.clear();
      alert("All data cleared.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your local data and preferences.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Theme
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Currently: <span className="capitalize">{theme}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === "light" ? (
                <>
                  <Moon className="h-3.5 w-3.5" /> Dark
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5" /> Light
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data management */}
      <Card>
        <CardHeader>
          <CardTitle>Data management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row
            label="Clear answers"
            desc="Removes all attempted-question history."
            onClick={() => run("Clear all answers", clearAllAnswers)}
            disabled={busy}
          />
          <Row
            label="Clear session history"
            desc="Removes past test results from dashboard."
            onClick={() => run("Clear sessions", clearAllSessions)}
            disabled={busy}
          />
          <Row
            label="Clear bookmarks"
            desc="Removes all bookmarked questions."
            onClick={() => run("Clear bookmarks", clearAllBookmarks)}
            disabled={busy}
          />
          <Row
            label="Clear notepad"
            desc="Wipes the scratchpad text."
            onClick={() => run("Clear notepad", clearNotepad)}
            disabled={busy}
          />
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" /> Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Row
            label="Reset everything"
            desc="Deletes all local data. Fresh start."
            onClick={resetEverything}
            disabled={busy}
            danger
          />
        </CardContent>
      </Card>

      <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-4">
        All data is stored locally in your browser. Nothing is sent to any server.
      </div>
    </div>
  );
}

function Row({
  label,
  desc,
  onClick,
  disabled,
  danger,
}: {
  label: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {desc}
        </div>
      </div>
      <Button
        variant={danger ? "danger" : "outline"}
        size="sm"
        onClick={onClick}
        disabled={disabled}
      >
        <Trash2 className="h-3.5 w-3.5" /> {danger ? "Reset" : "Clear"}
      </Button>
    </div>
  );
}