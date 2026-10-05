export type Section = "Numerical" | "Verbal" | "Reasoning" | "Programming";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  section: Section;
  topic: string;
  difficulty: Difficulty;
  type: "mcq";
  question: string;
  image?: string | null;
  options: string[];
  correctIndex: number;
  tags?: string[];
}

export type AnswerStatus = "answered" | "skipped" | "unanswered" | "marked";

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number | null;
  status: AnswerStatus;
  timeSpentSec: number;
  updatedAt: number;
}

export type QuizMode = "practice" | "timed" | "mock" | "review";

export type SectionOrMixed = Section | "mixed";  

export interface Session {
  id: string;
  mode: QuizMode;
  section: SectionOrMixed;                      
  questionIds: string[];
  startedAt: number;
  endedAt: number | null;
  answers: Record<string, AnswerRecord>;
  score?: {
    correct: number;
    wrong: number;
    skipped: number;
    totalTimeSec: number;
  };
}