import { Play, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useRestoreSession } from "../../hooks/useRestoreSession";
import { useNavigate } from "react-router-dom";

export function ResumeBanner() {
  const { pending, checked, restore, discard } = useRestoreSession();
  const navigate = useNavigate();

  if (!checked || !pending) return null;

  const label = pending.section === "mixed" ? "Full Mock" : pending.section;

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-indigo-900">
          Resume your last session
        </div>
        <div className="text-xs text-indigo-700 mt-0.5 truncate">
          {label} · {pending.mode} mode · {pending.questionIds.length} questions
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={discard}
          className="text-indigo-700 hover:bg-indigo-100"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            restore();
            navigate(`/quiz/${pending.id}`);
          }}
        >
          <Play className="h-3.5 w-3.5" /> Resume
        </Button>
      </div>
    </div>
  );
}