import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Timer, Filter } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import {
  SECTION_META,
  getTopicSummary,
  getQuestionsByTopic,
} from "../utils/questions";
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

const VALID_SECTIONS: Section[] = [
  "Numerical",
  "Verbal",
  "Reasoning",
  "Programming",
];

export default function SectionTopics() {
  const { section: rawSection } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const startSession = useQuizStore((s) => s.startSession);
  const stats = useStats();

  const [filter, setFilter] = useState<FilterKey>("all");

  const section = useMemo(() => {
    if (!rawSection) return null;
    const match = VALID_SECTIONS.find(
      (s) => s.toLowerCase() === rawSection.toLowerCase()
    );
    return match ?? null;
  }, [rawSection]);

  if (!section) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Section not found.
        </p>
        <Link to="/practice">
          <Button>Back to Practice</Button>
        </Link>
      </div>
    );
  }

  const meta = SECTION_META[section];
  const topicSummaries = getTopicSummary(section);
  const sectionStats = stats?.bySection[section];

  const start = (topic: string, mode: "practice" | "mock") => {
    const topicQuestions = getQuestionsByTopic(section, topic);
    if (topicQuestions.length === 0) return;

    // Build session but override the questionIds with the topic's set
    const session = buildSession({
      mode,
      section,
      limit: mode === "mock" ? undefined : 10,
      shuffleQuestions: true,
    });

    // Keep only topic questions (in case buildSession picked others)
    const topicIds = new Set(topicQuestions.map((q) => q.id));
    const filtered = session.questionIds.filter((id) => topicIds.has(id));

    // If random slice happened to exclude too many, fall back to topic set
    const finalIds =
      filtered.length >= 3
        ? filtered
        : topicQuestions.slice(0, mode === "mock" ? 40 : 10).map((q) => q.id);

    session.questionIds = finalIds;

    startSession(session);
    navigate(`/quiz/${session.id}`);
  };

  const startWholeSection = () => {
    const session = buildSession({
      mode: "mock",
      section,
      shuffleQuestions: true,
    });
    startSession(session);
    navigate(`/quiz/${session.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/practice"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Practice
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset mb-2",
              meta.bg,
              meta.color,
              meta.ring,
              "dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
            )}
          >
            {meta.short}
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {meta.label}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {topicSummaries.length} topics · {sectionStats?.attempted ?? 0}{" "}
            attempted · {sectionStats?.accuracy ?? 0}% accuracy
          </p>
        </div>
        <Button onClick={startWholeSection}>
          <Timer className="h-4 w-4" /> Full Section Mock
        </Button>
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

      {/* Topic grid */}
      {topicSummaries.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No topics in this section yet. Add questions to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topicSummaries.map(({ topic, total }) => {
            return (
              <Card key={topic} hover>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {topic}
                    </h3>
                    <Badge tone="neutral">{total} Qs</Badge>
                  </div>

                  <ProgressBar value={0} className="mb-3" />

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => start(topic, "practice")}
                    >
                      <Play className="h-3.5 w-3.5" /> Practice
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => start(topic, "mock")}
                    >
                      <Timer className="h-3.5 w-3.5" /> Mock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}