export type Question = {
  id: string;
  type: "grammar" | "vocabulary" | "correction";
  question: string;
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
};

export const GRAMMAR_QUESTIONS: Question[] = [
  {
    id: "g1",
    type: "grammar",
    question: "She ___ to the gym every Monday.",
    options: ["go", "goes", "going", "gone"],
    correctAnswer: "goes",
    correctIndex: 1,
  },
  {
    id: "g2",
    type: "grammar",
    question: "If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    correctAnswer: "were",
    correctIndex: 2,
  },
  {
    id: "g3",
    type: "grammar",
    question: "The book ___ on the table belongs to me.",
    options: ["lay", "lain", "lying", "lies"],
    correctAnswer: "lying",
    correctIndex: 2,
  },
  {
    id: "g4",
    type: "grammar",
    question: "By next year, she ___ her degree.",
    options: ["will complete", "will have completed", "completes", "has completed"],
    correctAnswer: "will have completed",
    correctIndex: 1,
  },
  {
    id: "g5",
    type: "grammar",
    question: "Neither of the boys ___ finished the homework.",
    options: ["have", "has", "having", "had"],
    correctAnswer: "has",
    correctIndex: 1,
  },
];

export const VOCABULARY_QUESTIONS: Question[] = [
  {
    id: "v1",
    type: "vocabulary",
    question: "What is the opposite of 'ancient'?",
    options: ["old", "modern", "historic", "classic"],
    correctAnswer: "modern",
    correctIndex: 1,
  },
  {
    id: "v2",
    type: "vocabulary",
    question: "Choose the correct word: The meeting was ___ due to bad weather.",
    options: ["postponed", "delayed", "cancelled", "suspended"],
    correctAnswer: "postponed",
    correctIndex: 0,
  },
  {
    id: "v3",
    type: "vocabulary",
    question: "What does 'reluctant' mean?",
    options: ["eager", "unwilling", "happy", "excited"],
    correctAnswer: "unwilling",
    correctIndex: 1,
  },
  {
    id: "v4",
    type: "vocabulary",
    question: "She has a ___ for classical music.",
    options: ["preference", "prefer", "preferable", "preferably"],
    correctAnswer: "preference",
    correctIndex: 0,
  },
  {
    id: "v5",
    type: "vocabulary",
    question: "The results were ___ - nobody expected such success.",
    options: ["amazing", "amazed", "amazement", "amazingly"],
    correctAnswer: "amazing",
    correctIndex: 0,
  },
];

export const CORRECTION_QUESTIONS: Question[] = [
  {
    id: "c1",
    type: "correction",
    question: "He don't like coffee. (Find and correct the error)",
    options: ["He doesn't like coffee.", "He didn't like coffee.", "He won't like coffee.", "He hasn't like coffee."],
    correctAnswer: "He doesn't like coffee.",
    correctIndex: 0,
  },
  {
    id: "c2",
    type: "correction",
    question: "She has been working here since five years. (Find and correct the error)",
    options: ["She has been working here for five years.", "She has worked here since five years.", "She is working here for five years.", "She worked here since five years."],
    correctAnswer: "She has been working here for five years.",
    correctIndex: 0,
  },
  {
    id: "c3",
    type: "correction",
    question: "I have seen him yesterday. (Find and correct the error)",
    options: ["I saw him yesterday.", "I had seen him yesterday.", "I see him yesterday.", "I am seeing him yesterday."],
    correctAnswer: "I saw him yesterday.",
    correctIndex: 0,
  },
];

export const ALL_QUESTIONS = [
  ...GRAMMAR_QUESTIONS,
  ...VOCABULARY_QUESTIONS,
  ...CORRECTION_QUESTIONS,
];

export function getLevelFromScore(score: number, total: number): string {
  const ratio = score / total;
  if (ratio <= 0.31) return "A1";
  if (ratio <= 0.54) return "A2";
  if (ratio <= 0.77) return "B1";
  return "B2";
}

export function getStrengthsAndWeaknesses(
  grammarCorrect: number,
  vocabCorrect: number,
  correctionCorrect: number
) {
  const sections = [
    { name: "Grammar", score: grammarCorrect, total: 5 },
    { name: "Vocabulary", score: vocabCorrect, total: 5 },
    { name: "Sentence Correction", score: correctionCorrect, total: 3 },
  ].sort((a, b) => b.score / b.total - a.score / a.total);

  const strengths = sections
    .filter((s) => s.score / s.total >= 0.6)
    .map((s) => s.name);
  const weaknesses = sections
    .filter((s) => s.score / s.total < 0.6)
    .map((s) => s.name);

  return { strengths, weaknesses };
}
