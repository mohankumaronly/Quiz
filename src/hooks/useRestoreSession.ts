import { useEffect, useState } from "react";
import { useQuizStore } from "../store/quizStore";
import { getActiveSessionId, loadSession } from "../storage/progressRepo";
import type { Session } from "../types";

export function useRestoreSession() {
  const [pending, setPending] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const activeId = await getActiveSessionId();
      if (!activeId) {
        setChecked(true);
        return;
      }
      const stored = await loadSession(activeId);
      if (!stored || stored.endedAt) {
        setChecked(true);
        return;
      }
      setPending({
        id: stored.id,
        mode: stored.mode,
        section: stored.section,
        questionIds: stored.questionIds,
        startedAt: stored.startedAt,
        endedAt: null,
        answers: stored.answersSnapshot ?? {},
      });
      setChecked(true);
    })();
  }, []);

  const restore = () => {
    if (!pending) return;
    useQuizStore.getState().startSession(pending);
  };

  const discard = async () => {
    const { clearActiveSession } = await import("../storage/progressRepo");
    await clearActiveSession();
    setPending(null);
  };

  return { pending, checked, restore, discard };
}