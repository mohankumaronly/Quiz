import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Play, RotateCcw, TrendingUp, Target, Flame, Clock } from "lucide-react";
import { useStats } from "../hooks/useStats";
import { SECTIONS, SECTION_META, getQuestionsBySection } from "../utils/questions";
import { useQuizStore } from "../store/quizStore";
import { buildSession } from "../engine/quizEngine";
import { ResumeBanner } from "../components/layout/ResumeBanner";

export default function Dashboard() {
  const stats = useStats();
  const navigate = useNavigate();
  const startSession = useQuizStore((s) => s.startSession);

  const totalTimeMin = stats ? Math.round(stats.totalTimeSec / 60) : 0;

  const tiles = [
    {
      label: "Attempted",
      value: stats?.totalAttempted ?? 0,
      icon: Target,
      tone: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950",
    },
    {
      label: "Accuracy",
      value: `${stats?.accuracy ?? 0}%`,
      icon: TrendingUp,
      tone: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950",
    },
    {
      label: "Streak",
      value: "0d",
      icon: Flame,
      tone: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
    },
    {
      label: "Time spent",
      value: `${totalTimeMin}m`,
      icon: Clock,
      tone: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800",
    },
  ];

  const handleStart = () => {
    const session = buildSession({
      mode: "mock",
      section: "mixed",
      shuffleQuestions: true,
    });
    startSession(session);
    navigate(`/quiz/${session.id}`);
  };

  return (
    <div className="space-y-8">
      <ResumeBanner />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready to sharpen your NQT skills today?
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/review">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4" /> Review wrong
            </Button>
          </Link>
          <Button onClick={handleStart}>
            <Play className="h-4 w-4" /> Start Mock Test
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((s) => (
          <Card key={s.label} hover>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
                  {s.label}
                </div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
                  {s.value}
                </div>
              </div>
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.tone}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats || stats.recentSessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  No sessions yet. Start a practice or mock test to begin.
                </div>
                <Button className="mt-4" size="sm" onClick={handleStart}>
                  <Play className="h-3.5 w-3.5" /> Start now
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentSessions.map((s) => {
                  const acc = s.score
                    ? Math.round(
                        (s.score.correct /
                          Math.max(
                            1,
                            s.score.correct + s.score.wrong + s.score.skipped
                          )) *
                          100
                      )
                    : 0;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {s.section === "mixed" ? "Full Mock" : s.section} ·{" "}
                          <span className="capitalize text-slate-500 dark:text-slate-400">
                            {s.mode}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                          {new Date(s.startedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {s.score && (
                          <Badge
                            tone={
                              acc >= 70
                                ? "success"
                                : acc >= 50
                                ? "warning"
                                : "danger"
                            }
                          >
                            {acc}%
                          </Badge>
                        )}
                        {!s.endedAt && <Badge tone="warning">In progress</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Section progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SECTIONS.map((sec) => {
              const total = getQuestionsBySection(sec).length;
              const attempted = stats?.bySection[sec]?.attempted ?? 0;
              const pct = total ? (attempted / total) * 100 : 0;
              const meta = SECTION_META[sec];
              return (
                <div key={sec}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {meta.short}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums text-xs">
                      {attempted}/{total}
                    </span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}