import { Clock } from "lucide-react";

interface Props {
  seconds: number;
  running?: boolean;
}

function fmt(total: number) {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = Math.floor(total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function QuizTimer({ seconds, running = true }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
      <Clock
        className={`h-4 w-4 ${
          running ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
        }`}
      />
      <span className="tabular-nums font-medium text-sm">{fmt(seconds)}</span>
    </div>
  );
}