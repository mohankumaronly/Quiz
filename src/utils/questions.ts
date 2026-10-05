import type { Question, Section } from "../types";

import numerical from "../data/questions/numerical.json";
import verbal from "../data/questions/verbal.json";
import reasoning from "../data/questions/reasoning.json";
import programming from "../data/questions/programming.json";

export const ALL_QUESTIONS: Question[] = [
  ...(numerical as Question[]),
  ...(verbal as Question[]),
  ...(reasoning as Question[]),
  ...(programming as Question[]),
];

export const SECTIONS: Section[] = [
  "Numerical",
  "Verbal",
  "Reasoning",
  "Programming",
];

export const SECTION_META: Record<
  Section,
  { label: string; short: string; color: string; bg: string; ring: string }
> = {
  Numerical: {
    label: "Numerical Ability",
    short: "Numerical",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    ring: "ring-indigo-200",
  },
  Verbal: {
    label: "Verbal Ability",
    short: "Verbal",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  Reasoning: {
    label: "Reasoning Ability",
    short: "Reasoning",
    color: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  Programming: {
    label: "Programming Logic",
    short: "Programming",
    color: "text-rose-600",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
  },
};

export function getQuestionsBySection(section: Section): Question[] {
  return ALL_QUESTIONS.filter((q) => q.section === section);
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

/* ---------- Topic helpers ---------- */

/**
 * Get all unique topics for a section, sorted alphabetically.
 */
export function getTopicsBySection(section: Section): string[] {
  const topics = new Set<string>();
  for (const q of ALL_QUESTIONS) {
    if (q.section === section) topics.add(q.topic);
  }
  return Array.from(topics).sort();
}

/**
 * Get all questions for a section + topic combo.
 */
export function getQuestionsByTopic(
  section: Section,
  topic: string
): Question[] {
  return ALL_QUESTIONS.filter(
    (q) => q.section === section && q.topic === topic
  );
}


export function getTopicSummary(section: Section) {
  return getTopicsBySection(section).map((topic) => {
    const questions = getQuestionsByTopic(section, topic);
    return {
      topic,
      total: questions.length,
    };
  });
}