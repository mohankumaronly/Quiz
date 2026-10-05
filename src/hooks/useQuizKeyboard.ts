import { useEffect } from "react";
import { useQuizStore } from "../store/quizStore";
import { getQuestionById } from "../utils/questions";

export function useQuizKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const state = useQuizStore.getState();
      const { session, currentIndex } = state;
      if (!session) return;

      const qid = session.questionIds[currentIndex];
      if (!qid) return;
      const q = getQuestionById(qid);
      if (!q) return;

      const key = e.key.toLowerCase();

      // A/B/C/D or 1/2/3/4 to pick option
      const letterIdx = ["a", "b", "c", "d", "e", "f"].indexOf(key);
      const numIdx = ["1", "2", "3", "4", "5", "6"].indexOf(key);
      const optIdx = letterIdx !== -1 ? letterIdx : numIdx;

      if (optIdx !== -1 && optIdx < q.options.length) {
        e.preventDefault();
        state.selectOption(qid, optIdx);
        return;
      }

      // Navigation
      if (key === "arrowright" || key === "enter") {
        e.preventDefault();
        state.next();
      } else if (key === "arrowleft") {
        e.preventDefault();
        state.prev();
      } else if (key === "m") {
        e.preventDefault();
        state.toggleMark(qid);
      } else if (key === "c") {
        e.preventDefault();
        state.clearAnswer(qid);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}