import { create } from "zustand";
import type { AnswerRecord, Session } from "../types";
import { scoreSession } from "../engine/quizEngine";
import { saveAnswer, saveSession } from "../storage/progressRepo";

interface QuizState {
  session: Session | null;
  currentIndex: number;

  startSession: (session: Session) => void;
  endSession: () => void;

  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;

  selectOption: (questionId: string, optionIndex: number) => void;
  clearAnswer: (questionId: string) => void;
  toggleMark: (questionId: string) => void;

  getAnswer: (questionId: string) => AnswerRecord | undefined;
  finalize: () => Session | null;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  session: null,
  currentIndex: 0,

  startSession: (session) => set({ session, currentIndex: 0 }),

  endSession: () => set({ session: null, currentIndex: 0 }),

  goTo: (index) => {
    const { session } = get();
    if (!session) return;
    const clamped = Math.max(0, Math.min(session.questionIds.length - 1, index));
    set({ currentIndex: clamped });
  },

  next: () => {
    const { currentIndex, session } = get();
    if (!session) return;
    if (currentIndex < session.questionIds.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
  },

  selectOption: (questionId, optionIndex) => {
    const { session } = get();
    if (!session) return;
    const prevRec = session.answers[questionId];
    const next: AnswerRecord = {
      questionId,
      selectedIndex: optionIndex,
      status: prevRec?.status === "marked" ? "marked" : "answered",
      timeSpentSec: prevRec?.timeSpentSec ?? 0,
      updatedAt: Date.now(),
    };
    set({
      session: {
        ...session,
        answers: { ...session.answers, [questionId]: next },
      },
    });
    if (session.section !== "mixed") saveAnswer(next, session.section);
  },

  clearAnswer: (questionId) => {
    const { session } = get();
    if (!session) return;
    const prevRec = session.answers[questionId];
    const next: AnswerRecord = {
      questionId,
      selectedIndex: null,
      status: prevRec?.status === "marked" ? "marked" : "unanswered",
      timeSpentSec: prevRec?.timeSpentSec ?? 0,
      updatedAt: Date.now(),
    };
    set({
      session: {
        ...session,
        answers: { ...session.answers, [questionId]: next },
      },
    });
  },

  toggleMark: (questionId) => {
    const { session } = get();
    if (!session) return;
    const prev = session.answers[questionId];
    const isMarked = prev?.status === "marked";

    const next: AnswerRecord = {
      questionId,
      selectedIndex: prev?.selectedIndex ?? null,
      status: isMarked
        ? prev?.selectedIndex !== null
          ? "answered"
          : "unanswered"
        : "marked",
      timeSpentSec: prev?.timeSpentSec ?? 0,
      updatedAt: Date.now(),
    };

    set({
      session: {
        ...session,
        answers: { ...session.answers, [questionId]: next },
      },
    });
  },

  getAnswer: (questionId) => get().session?.answers[questionId],

  finalize: () => {
    const { session } = get();
    if (!session) return null;
    const finalized: Session = {
      ...session,
      endedAt: Date.now(),
      score: scoreSession(session),
    };
    set({ session: finalized });
    saveSession(finalized);
    return finalized;
  },
}));