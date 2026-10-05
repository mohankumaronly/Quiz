import type { Question, QuizMode, Section, Session } from "../types";
import { ALL_QUESTIONS, getQuestionsBySection } from "../utils/questions";

let counter = 0;
function generateId() {
  counter += 1;
  return `s_${Date.now()}_${counter}`;
}

interface BuildOptions {
  mode: QuizMode;
  section: Section | "mixed";
  limit?: number;
  shuffleQuestions?: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildSession(opts: BuildOptions): Session {
  const { mode, section, limit, shuffleQuestions = true } = opts;

  let pool: Question[] =
    section === "mixed" ? [...ALL_QUESTIONS] : getQuestionsBySection(section);

  if (shuffleQuestions) pool = shuffle(pool);
  if (limit && limit > 0) pool = pool.slice(0, limit);

  return {
    id: generateId(),
    mode,
    section,
    questionIds: pool.map((q) => q.id),
    startedAt: Date.now(),
    endedAt: null,
    answers: {},
  };
}

export function scoreSession(session: Session): Session["score"] {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let totalTimeSec = 0;

  for (const qid of session.questionIds) {
    const rec = session.answers[qid];
    if (!rec || rec.selectedIndex === null) {
      skipped += 1;
      if (rec) totalTimeSec += rec.timeSpentSec;
      continue;
    }
    const q = ALL_QUESTIONS.find((x) => x.id === qid);
    if (!q) continue;
    if (rec.selectedIndex === q.correctIndex) correct += 1;
    else wrong += 1;
    totalTimeSec += rec.timeSpentSec;
  }

  return { correct, wrong, skipped, totalTimeSec };
}