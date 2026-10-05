import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useQuizStore } from "../store/quizStore";
import { getQuestionById } from "../utils/questions";

export default function Result() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = useQuizStore((s) => s.session);
  const endSession = useQuizStore((s) => s.endSession);

  const score = session?.score;
  const total = session?.questionIds.length ?? 0;
  const correct = score?.correct ?? 0;
  const wrong = score?.wrong ?? 0;
  const skipped = score?.skipped ?? 0;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  const circ = useMemo(() => {
    const r = 56;
    const c = 2 * Math.PI * r;
    const pct = total ? correct / total : 0;
    return { r, c, offset: c * (1 - pct) };
  }, [correct, total]);

  if (!session || session.id !== sessionId || !session.score) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              No result found.
            </p>
            <Button onClick={() => navigate("/practice")}>
              Back to Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const duration = Math.floor((session.score.totalTimeSec || 0) / 60);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero */}
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
              Test Completed
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">
              {session.section === "mixed" ? "Full Mock" : session.section} ·{" "}
              <span className="capitalize">{session.mode}</span>
            </h1>

            {/* Donut */}
            <div className="relative w-40 h-40 mx-auto mt-6">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r={circ.r}
                  strokeWidth="12"
                  className="fill-none stroke-slate-100 dark:stroke-slate-800"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={circ.r}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circ.c}
                  strokeDashoffset={circ.offset}
                  className="fill-none stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {accuracy}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  accuracy
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 tabular-nums">
              {correct} correct out of {total} questions
            </p>
          </CardContent>
        </Card>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile
            icon={CheckCircle2}
            tone="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950"
            value={correct}
            label="Correct"
          />
          <StatTile
            icon={XCircle}
            tone="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950"
            value={wrong}
            label="Wrong"
          />
          <StatTile
            icon={MinusCircle}
            tone="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
            value={skipped}
            label="Skipped"
          />
          <StatTile
            icon={Clock}
            tone="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950"
            value={`${duration}m`}
            label="Time"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/practice" className="flex-1" onClick={() => endSession()}>
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4" /> Back to Practice
            </Button>
          </Link>
          <Link to="/practice" className="flex-1" onClick={() => endSession()}>
            <Button className="w-full">
              <RotateCcw className="h-4 w-4" /> Practice again
            </Button>
          </Link>
        </div>

        {/* Question list */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Question breakdown
            </h3>
            <div className="space-y-2">
              {session.questionIds.map((qid, i) => {
                const q = getQuestionById(qid);
                const rec = session.answers[qid];
                const isCorrect =
                  rec?.selectedIndex !== null &&
                  rec?.selectedIndex === q?.correctIndex;
                const isSkipped = !rec || rec.selectedIndex === null;

                return (
                  <div
                    key={qid}
                    className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 tabular-nums w-8">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
                      {q?.question}
                    </span>
                    <span
                      className={
                        isSkipped
                          ? "text-xs text-slate-400 dark:text-slate-500"
                          : isCorrect
                          ? "text-xs text-green-600 dark:text-green-400 font-medium"
                          : "text-xs text-red-600 dark:text-red-400 font-medium"
                      }
                    >
                      {isSkipped ? "Skipped" : isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  tone,
  value,
  label,
}: {
  icon: any;
  tone: string;
  value: number | string;
  label: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
            {value}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}