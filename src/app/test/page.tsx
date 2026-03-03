"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ALL_QUESTIONS,
  getLevelFromScore,
  getStrengthsAndWeaknesses,
  type Question,
} from "@/data/testQuestions";

export default function TestPage() {
  return (
    <ProtectedRoute>
      <TestContent />
    </ProtectedRoute>
  );
}

function TestContent() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const question = ALL_QUESTIONS[currentIndex];
  const total = ALL_QUESTIONS.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const handleAnswer = (optionIndex: number) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    let score = 0;
    let grammarCorrect = 0;
    let vocabCorrect = 0;
    let correctionCorrect = 0;

    ALL_QUESTIONS.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer !== undefined && q.correctIndex === userAnswer) {
        score++;
        if (q.type === "grammar") grammarCorrect++;
        if (q.type === "vocabulary") vocabCorrect++;
        if (q.type === "correction") correctionCorrect++;
      }
    });

    const level = getLevelFromScore(score, total);
    const { strengths, weaknesses } = getStrengthsAndWeaknesses(
      grammarCorrect,
      vocabCorrect,
      correctionCorrect
    );

    const result = {
      score,
      total,
      level,
      grammarScore: grammarCorrect,
      vocabularyScore: vocabCorrect,
      correctionScore: correctionCorrect,
      strengths,
      weaknesses,
    };

    setLoading(true);
    try {
      // Сохраняем результат локально для страницы /result
      localStorage.setItem("testResult", JSON.stringify(result));
    } catch {
      // ignore
    }
    router.push("/result");
  };

  if (!question) return null;

  const canNext = answers[question.id] !== undefined;

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Вопрос {currentIndex + 1} из {total}</span>
            <span>
              {question.type === "grammar"
                ? "Grammar"
                : question.type === "vocabulary"
                ? "Vocabulary"
                : "Sentence Correction"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  answers[question.id] === idx
                    ? "border-accent-start bg-accent-start/5 text-accent-start"
                    : "border-gray-200 hover:border-accent-start/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Назад
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext}
              className="px-6 py-3 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition"
            >
              {currentIndex === total - 1 ? "Завершить" : "Далее"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
