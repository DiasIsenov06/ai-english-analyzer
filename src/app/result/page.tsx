"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";

type Result = {
  score: number;
  total: number;
  level: string;
  grammarScore: number;
  vocabularyScore: number;
  correctionScore: number;
  strengths: string[];
  weaknesses: string[];
};

export default function ResultPage() {
  return (
    <ProtectedRoute>
      <ResultContent />
    </ProtectedRoute>
  );
}

function ResultContent() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("testResult");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.replace("/test");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Загрузка результата...</div>
      </div>
    );
  }

  const mascotMessage =
    result.level === "A1"
      ? "Бастамасы жақсы! Бірге өсеміз 🚀"
      : result.level === "A2"
      ? "Жақсы progress бар! Алға жалғастырайық 🌟"
      : result.level === "B1"
      ? "Жақсы деңгей! Тағы сәл қалды 🔥"
      : "Керемет нәтиже! 🎉";

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 to-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 mb-3">
              <Image
                src="/images/mascot-result.png"
                alt="Aqyldy_barys result mascot"
                fill
                className="object-contain"
                priority
              />
            </div>

            <p className="text-sm md:text-base text-gray-600 font-medium text-center">
              {mascotMessage}
            </p>
          </div>

          <h1 className="text-2xl font-bold text-center mb-8">
            Результат AI-диагностики
          </h1>

          <div className="text-center mb-8">
            <p className="text-5xl font-extrabold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">
              {result.score}/{result.total}
            </p>
            <p className="text-xl font-semibold mt-2 text-gray-700">
              Ваш уровень:{" "}
              <span className="text-accent-start">{result.level}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Grammar</p>
              <p className="text-xl font-bold">{result.grammarScore}/5</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Vocabulary</p>
              <p className="text-xl font-bold">{result.vocabularyScore}/5</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Correction</p>
              <p className="text-xl font-bold">{result.correctionScore}/3</p>
            </div>
          </div>

          {result.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-green-700 mb-2">
                ✓ Сильные стороны
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {result.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.weaknesses.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-amber-700 mb-2">
                ⚠ Слабые стороны
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {result.weaknesses.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/dashboard"
            className="block w-full py-4 text-center bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 transition-all"
          >
            Перейти в Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}