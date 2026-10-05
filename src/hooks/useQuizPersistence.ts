import { useEffect } from "react";
import { useQuizStore } from "../store/quizStore";
import {
  saveAnswer,
  saveSession,
  setActiveSession,
  clearActiveSession,
  updateSessionProgress,
} from "../storage/progressRepo";

export function useQuizPersistence() {
  const session = useQuizStore((s) => s.session);
  const currentIndex = useQuizStore((s) => s.currentIndex);

  // Save each answer as it changes
  useEffect(() => {
    if (!session) return;
    const section = session.section === "mixed" ? null : session.section;
    if (!section) return;
    for (const qid of session.questionIds) {
      const rec = session.answers[qid];
      if (rec) saveAnswer(rec, section);
    }
  }, [session]);

  // Mark session active when it starts
  useEffect(() => {
    if (!session) return;
    if (!session.endedAt) setActiveSession(session.id);
  }, [session?.id, session?.endedAt]);

  // Persist session snapshot on answer / index changes (in-progress only)
  useEffect(() => {
    if (!session || session.endedAt) return;
    updateSessionProgress(session.id, session.answers, currentIndex);
  }, [session?.answers, currentIndex, session?.id, session?.endedAt]);

  // On finalize → persist + clear active pointer
  useEffect(() => {
    if (!session) return;
    if (session.endedAt) {
      saveSession(session);
      clearActiveSession();
    }
  }, [session?.endedAt]);
}