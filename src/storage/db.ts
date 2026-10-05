import Dexie, { type Table } from "dexie";
import type { AnswerRecord, Session, Section } from "../types";

export interface StoredAnswer extends AnswerRecord {
  id: string;             // `${questionId}`
  section: Section;
  correct: boolean | null; // null = skipped
}

export interface StoredSession {
  id: string;
  mode: Session["mode"];
  section: Session["section"];
  questionIds: string[];
  startedAt: number;
  endedAt: number | null;
  score?: Session["score"];
  answersSnapshot?: Record<string, AnswerRecord>;   // ← new
  currentIndex?: number;   
}

export interface Bookmark {
  id: string;             // questionId
  addedAt: number;
}

export interface KV {
  key: string;
  value: unknown;
}

class AppDB extends Dexie {
  answers!: Table<StoredAnswer, string>;
  sessions!: Table<StoredSession, string>;
  bookmarks!: Table<Bookmark, string>;
  kv!: Table<KV, string>;

  constructor() {
    super("nqt_prep_db");
    this.version(1).stores({
      answers: "id, section, correct, updatedAt",
      sessions: "id, mode, section, startedAt, endedAt",
      bookmarks: "id, addedAt",
      kv: "key",
    });
  }
}

export const db = new AppDB();