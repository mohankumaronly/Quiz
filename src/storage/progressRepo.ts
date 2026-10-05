import { db, type StoredAnswer, type StoredSession } from "./db";
import type { AnswerRecord, Session, Section } from "../types";
import { getQuestionById } from "../utils/questions";

/* ---------- Answers ---------- */

export async function saveAnswer(
  record: AnswerRecord,
  section: Section
): Promise<void> {
  const q = getQuestionById(record.questionId);
  const correct =
    record.selectedIndex === null || !q
      ? null
      : record.selectedIndex === q.correctIndex;

  const stored: StoredAnswer = {
    ...record,
    id: record.questionId,
    section,
    correct,
  };
  await db.answers.put(stored);
}

export async function getAllAnswers(): Promise<StoredAnswer[]> {
  return db.answers.toArray();
}

export async function getAnswersBySection(
  section: Section
): Promise<StoredAnswer[]> {
  return db.answers.where("section").equals(section).toArray();
}

export async function clearAllAnswers(): Promise<void> {
  await db.answers.clear();
}

export async function clearAnswersBySection(section: Section): Promise<void> {
  await db.answers.where("section").equals(section).delete();
}

/* ---------- Sessions ---------- */

export async function saveSession(session: Session): Promise<void> {
  const stored: StoredSession = {
    id: session.id,
    mode: session.mode,
    section: session.section,
    questionIds: session.questionIds,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    score: session.score,
    answersSnapshot: session.answers,
    currentIndex: session.endedAt ? undefined : 0, // we set currentIndex elsewhere
  };
  await db.sessions.put(stored);
}

export async function loadSession(id: string): Promise<StoredSession | undefined> {
  return db.sessions.get(id);
}

export async function updateSessionProgress(
  id: string,
  answers: Record<string, AnswerRecord>,
  currentIndex: number
): Promise<void> {
  await db.sessions.update(id, { answersSnapshot: answers, currentIndex });
}

export async function getRecentSessions(limit = 5): Promise<StoredSession[]> {
  const all = await db.sessions.orderBy("startedAt").reverse().toArray();
  return all.slice(0, limit);
}

export async function getAllSessions(): Promise<StoredSession[]> {
  return db.sessions.orderBy("startedAt").reverse().toArray();
}

export async function clearAllSessions(): Promise<void> {
  await db.sessions.clear();
}

/* ---------- Stats ---------- */

export interface ProgressStats {
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  accuracy: number;
  bySection: Record<Section, { attempted: number; correct: number }>;
  totalTimeSec: number;
}

export async function getProgressStats(): Promise<ProgressStats> {
  const answers = await db.answers.toArray();
  const sessions = await db.sessions.toArray();

  const stats: ProgressStats = {
    totalAttempted: 0,
    totalCorrect: 0,
    totalWrong: 0,
    totalSkipped: 0,
    accuracy: 0,
    bySection: {
      Numerical: { attempted: 0, correct: 0 },
      Verbal: { attempted: 0, correct: 0 },
      Reasoning: { attempted: 0, correct: 0 },
      Programming: { attempted: 0, correct: 0 },
    },
    totalTimeSec: 0,
  };

  for (const a of answers) {
    stats.totalAttempted += 1;
    stats.totalTimeSec += a.timeSpentSec || 0;

    const bucket = stats.bySection[a.section];
    if (bucket) bucket.attempted += 1;

    if (a.correct === true) {
      stats.totalCorrect += 1;
      if (bucket) bucket.correct += 1;
    } else if (a.correct === false) {
      stats.totalWrong += 1;
    } else {
      stats.totalSkipped += 1;
    }
  }

  stats.accuracy = stats.totalAttempted
    ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
    : 0;

  // Total time from completed sessions
  for (const s of sessions) {
    if (s.score?.totalTimeSec) stats.totalTimeSec += s.score.totalTimeSec;
  }

  return stats;
}

/* ---------- Reset ---------- */

export async function resetAllProgress(): Promise<void> {
  await db.answers.clear();
  await db.sessions.clear();
  await db.bookmarks.clear();
  await db.kv.clear();
}

/* ---------- Active session pointer ---------- */

const ACTIVE_KEY = "active_session_id";

export async function setActiveSession(id: string): Promise<void> {
  await db.kv.put({ key: ACTIVE_KEY, value: id });
}

export async function getActiveSessionId(): Promise<string | null> {
  const row = await db.kv.get(ACTIVE_KEY);
  return typeof row?.value === "string" ? row.value : null;
}

export async function clearActiveSession(): Promise<void> {
  await db.kv.delete(ACTIVE_KEY);
}