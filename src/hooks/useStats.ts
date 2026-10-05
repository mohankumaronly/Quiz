import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../storage/db";
import type { Section } from "../types";

export interface SectionStat {
  attempted: number;
  correct: number;
  accuracy: number;
}

export function useStats() {
  return useLiveQuery(async () => {
    const answers = await db.answers.toArray();
    const sessions = await db.sessions.toArray();

    const totalAttempted = answers.length;
    const totalCorrect = answers.filter((a) => a.correct === true).length;
    const totalWrong = answers.filter((a) => a.correct === false).length;
    const totalSkipped = answers.filter((a) => a.correct === null).length;
    const accuracy = totalAttempted
      ? Math.round((totalCorrect / totalAttempted) * 100)
      : 0;

    const totalTimeSec = sessions.reduce(
      (sum, s) => sum + (s.score?.totalTimeSec ?? 0),
      0
    );

    const bySection: Record<Section, SectionStat> = {
      Numerical: { attempted: 0, correct: 0, accuracy: 0 },
      Verbal: { attempted: 0, correct: 0, accuracy: 0 },
      Reasoning: { attempted: 0, correct: 0, accuracy: 0 },
      Programming: { attempted: 0, correct: 0, accuracy: 0 },
    };

    for (const a of answers) {
      const b = bySection[a.section];
      if (!b) continue;
      b.attempted += 1;
      if (a.correct === true) b.correct += 1;
    }
    for (const k of Object.keys(bySection) as Section[]) {
      const b = bySection[k];
      b.accuracy = b.attempted
        ? Math.round((b.correct / b.attempted) * 100)
        : 0;
    }

    return {
      totalAttempted,
      totalCorrect,
      totalWrong,
      totalSkipped,
      accuracy,
      totalTimeSec,
      bySection,
      recentSessions: sessions
        .sort((a, b) => b.startedAt - a.startedAt)
        .slice(0, 5),
    };
  }, []);
}