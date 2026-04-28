"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ALL_QUESTIONS,
  getLevelFromScore,
  getStrengthsAndWeaknesses,
} from "@/data/testQuestions";

type StoredUser = {
  id: string;
  email: string;
  level?: string;
  goal?: string;
  hasCompletedOnboarding?: boolean;
};

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
    if (!question || loading) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const handleNext = () => {
    if (loading) return;

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (loading) return;
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);

    try {
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

      localStorage.setItem("testResult", JSON.stringify(result));

      const storedUserRaw = localStorage.getItem("user");

      if (storedUserRaw) {
        const storedUser: StoredUser = JSON.parse(storedUserRaw);

        if (storedUser.id) {
          const saveResultResponse = await fetch("/api/test-results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: storedUser.id,
              score: result.score,
              total: result.total,
              level: result.level,
              grammarScore: result.grammarScore,
              vocabularyScore: result.vocabularyScore,
              correctionScore: result.correctionScore,
              strengths: result.strengths,
              weaknesses: result.weaknesses,
            }),
          });

          if (!saveResultResponse.ok) {
            const errorData = await saveResultResponse.json().catch(() => null);
            console.error("Test result save failed:", errorData);
          }

          const onboardingResponse = await fetch(
            "/api/user/complete-onboarding",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: storedUser.id }),
            }
          );

          if (onboardingResponse.ok) {
            const data = await onboardingResponse.json();

            const updatedUser: StoredUser = {
              id: data.user.id,
              email: data.user.email,
              level: data.user.level,
              goal: data.user.goal,
              hasCompletedOnboarding: data.user.hasCompletedOnboarding,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
          } else {
            const errorData = await onboardingResponse.json().catch(() => null);
            console.error("Complete onboarding failed:", errorData);
          }
        }
      }

      router.push("/result");
    } catch (e) {
      console.error("Error saving test:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!question) return null;

  const canNext = answers[question.id] !== undefined;

  const sectionLabel =
    question.type === "grammar"
      ? "Grammar"
      : question.type === "vocabulary"
      ? "Vocabulary"
      : "Sentence Correction";

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 to-white px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 md:w-52 md:h-52">
                <Image
                  src="/images/mascot-test-clipboard.png"
                  alt="Aqyldy_barys"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-4 bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                Сұрақты мұқият оқы. Ең дұрыс жауапты таңда 😊
              </div>

              <div className="mt-4 w-full bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Прогресс</span>
                  <span>
                    {currentIndex + 1}/{total}
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700">
                  Бөлім: {sectionLabel}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Вопрос {currentIndex + 1} из {total}
                </span>
                <span>{sectionLabel}</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={loading}
                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all disabled:opacity-70 ${
                      answers[question.id] === idx
                        ? "border-accent-start bg-accent-start/5 text-accent-start"
                        : "border-gray-200 hover:border-accent-start/50 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-base font-medium">{opt}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0 || loading}
                  className="px-6 py-3 border border-gray-300 rounded-2xl font-medium disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Назад
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canNext || loading}
                  className="px-6 py-3 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-2xl font-semibold disabled:opacity-50 hover:shadow-lg transition"
                >
                  {loading
                    ? "Сақталуда..."
                    : currentIndex === total - 1
                    ? "Завершить"
                    : "Далее"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}