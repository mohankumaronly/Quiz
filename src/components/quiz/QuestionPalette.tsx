import { cn } from "../../utils/cn";
import type { AnswerRecord } from "../../types";

interface Props {
  total: number;
  current: number;
  answers: Record<string, AnswerRecord>;
  questionIds: string[];
  onJump: (index: number) => void;
}

export function QuestionPalette({
  total,
  current,
  answers,
  questionIds,
  onJump,
}: Props) {
  const counts = { answered: 0, marked: 0, unanswered: 0, visited: 0 };

  for (const qid of questionIds) {
    const rec = answers[qid];
    if (!rec) continue;
    if (rec.status === "marked") counts.marked += 1;
    else if (rec.selectedIndex !== null) counts.answered += 1;
    else counts.unanswered += 1;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const qid = questionIds[i];
          const rec = answers[qid];
          const isCurrent = i === current;

          let cls =
            "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
          if (rec?.status === "marked")
            cls =
              "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800";
          else if (rec?.selectedIndex !== null)
            cls =
              "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800";
          else if (rec)
            cls =
              "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800";

          return (
            <button
              key={qid}
              onClick={() => onJump(i)}
              className={cn(
                "h-9 rounded-lg border text-xs font-semibold tabular-nums transition-all",
                cls,
                isCurrent &&
                  "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5 text-xs">
        <Legend color="bg-green-500" label={`Answered (${counts.answered})`} />
        <Legend color="bg-red-500" label={`Not answered (${counts.unanswered})`} />
        <Legend color="bg-purple-500" label={`Marked (${counts.marked})`} />
        <Legend color="bg-slate-300 dark:bg-slate-600" label="Not visited" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </div>
  );
}