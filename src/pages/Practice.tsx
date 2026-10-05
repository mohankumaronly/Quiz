import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Timer, Filter, Layers } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SECTIONS, SECTION_META, getQuestionsBySection } from "../utils/questions";
import { buildSession } from "../engine/quizEngine";
import { useQuizStore } from "../store/quizStore";
import { useStats } from "../hooks/useStats";
import type { Section } from "../types";
import { cn } from "../utils/cn";

type FilterKey = "all" | "unattempted" | "wrong" | "bookmarked";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unattempted", label: "Unattempted" },
  { key: "wrong", label: "Wrong" },
  { key: "bookmarked", label: "Bookmarked" },
];

export default function Practice() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const navigate = useNavigate();
  const startSession = useQuizStore((s) => s.startSession);
  const stats = useStats();

  const start = (section: Section, mode: "practice" | "mock") => {
    const session = buildSession({
      mode,
      section,
      limit: mode === "mock" ? undefined : 10,
      shuffleQuestions: true,
    });
    startSession(session);
    navigate(`/quiz/${session.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Practice
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pick a section to drill, or explore topics inside each section.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 h-8 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              filter === f.key
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map((sec) => {
          const meta = SECTION_META[sec];
          const total = getQuestionsBySection(sec).length;
          const attempted = stats?.bySection[sec]?.attempted ?? 0;
          const correct = stats?.bySection[sec]?.correct ?? 0;
          const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
          const pct = total ? (attempted / total) * 100 : 0;

          return (
            <Card key={sec} hover className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset",
                        meta.bg,
                        meta.color,
                        meta.ring,
                        "dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                      )}
                    >
                      {meta.short}
                    </div>

                    {/* Clickable title → topics page */}
                    <Link to={`/practice/${sec}`} className="block mt-2 group">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {meta.label}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                      {total} questions · {accuracy}% accuracy
                    </p>
                  </div>
                  <Badge
                    tone={
                      accuracy >= 70
                        ? "success"
                        : accuracy >= 50
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {Math.round(pct)}%
                  </Badge>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={pct}
                    tone={
                      accuracy >= 70
                        ? "success"
                        : accuracy >= 50
                        ? "warning"
                        : "brand"
                    }
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5 tabular-nums">
                    <span>{attempted} attempted</span>
                    <span>{total - attempted} remaining</span>
                  </div>
                </div>

                {/* Three actions: Topics | Practice | Mock */}
                <div className="mt-5 flex gap-2">
                  <Link to={`/practice/${sec}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Layers className="h-3.5 w-3.5" /> Topics
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => start(sec, "practice")}
                    className="flex-1"
                  >
                    <Play className="h-3.5 w-3.5" /> Practice
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => start(sec, "mock")}
                    className="flex-1"
                  >
                    <Timer className="h-3.5 w-3.5" /> Mock
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full mock */}
      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Full Mock Test
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              All sections mixed — simulate the real NQT experience.
            </p>
          </div>
          <Button
            onClick={() => {
              const session = buildSession({
                mode: "mock",
                section: "mixed",
                shuffleQuestions: true,
              });
              startSession(session);
              navigate(`/quiz/${session.id}`);
            }}
          >
            <Timer className="h-4 w-4" /> Start Full Mock
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}