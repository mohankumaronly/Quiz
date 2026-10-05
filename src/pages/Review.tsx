import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { db } from "../storage/db";
import { getQuestionById } from "../utils/questions";
import { cn } from "../utils/cn";

type Tab = "wrong" | "bookmarked" | "all";

export default function Review() {
  const [tab, setTab] = useState<Tab>("wrong");

  const answers = useLiveQuery(() => db.answers.toArray(), []);
  const bookmarks = useLiveQuery(() => db.bookmarks.toArray(), []);

  const rows = (() => {
    if (!answers || !bookmarks) return [];
    if (tab === "wrong") {
      return answers.filter((a) => a.correct === false);
    }
    if (tab === "bookmarked") {
      const ids = new Set(bookmarks.map((b) => b.id));
      return answers.filter((a) => ids.has(a.id));
    }
    return answers;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Review
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Focus on what you got wrong or bookmarked.
        </p>
      </div>

      <div className="flex gap-2">
        {(["wrong", "bookmarked", "all"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-3 h-8 rounded-lg text-sm font-medium capitalize transition-colors",
              tab === t
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Nothing to review here yet. Practice a few questions first.
            </p>
            <Link to="/practice" className="inline-block mt-4">
              <Button size="sm">Go to Practice</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {rows.map((a, i) => {
              const q = getQuestionById(a.id);
              if (!q) return null;
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums w-6">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800 dark:text-slate-200 truncate">
                      {q.question}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {q.section} · {q.topic}
                    </div>
                  </div>
                  <Badge
                    tone={
                      a.correct === true
                        ? "success"
                        : a.correct === false
                        ? "danger"
                        : "neutral"
                    }
                  >
                    {a.correct === true
                      ? "Correct"
                      : a.correct === false
                      ? "Wrong"
                      : "Skipped"}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}