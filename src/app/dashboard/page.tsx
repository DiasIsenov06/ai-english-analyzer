"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import KpiCard from "./components/KpiCard";
import SkillBar from "./components/SkillBar";
import WeeklyActivityChart from "./components/WeeklyActivityChart";

type TestResult = {
  id: string;
  score: number;
  total: number;
  level: string;
  createdAt: string;
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [localTestResult, setLocalTestResult] = useState<{
    score: number;
    total: number;
    level: string;
    grammarScore?: number;
    vocabularyScore?: number;
    correctionScore?: number;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/test/results", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setResults(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("testResult");
      if (raw) setLocalTestResult(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const lastResult = results[0] ?? null;
  const effectiveTotal = lastResult?.total ?? localTestResult?.total ?? 13;
  const effectiveScore = lastResult?.score ?? localTestResult?.score ?? 0;
  const effectiveLevel =
    lastResult?.level ?? localTestResult?.level ?? user?.level ?? "—";

  const overallPercent =
    effectiveTotal > 0 ? Math.round((effectiveScore / effectiveTotal) * 100) : 0;

  // Skills: если нет данных — используем мягкие mock значения
  const grammarPct =
    localTestResult?.grammarScore != null
      ? Math.round((localTestResult.grammarScore / 5) * 100)
      : Math.max(30, Math.min(95, overallPercent + 6));
  const vocabPct =
    localTestResult?.vocabularyScore != null
      ? Math.round((localTestResult.vocabularyScore / 5) * 100)
      : Math.max(30, Math.min(95, overallPercent - 2));
  const writingPct = Math.max(25, Math.min(95, overallPercent - 6));
  const speakingPct = Math.max(25, Math.min(95, overallPercent - 8));
  const readingPct = Math.max(25, Math.min(95, overallPercent + 2));
  const listeningPct = Math.max(25, Math.min(95, overallPercent));

  const skills = [
    { key: "grammar", label: "Grammar", value: grammarPct },
    { key: "vocabulary", label: "Vocabulary", value: vocabPct },
    { key: "reading", label: "Reading", value: readingPct },
    { key: "listening", label: "Listening", value: listeningPct },
    { key: "writing", label: "Writing", value: writingPct },
    { key: "speaking", label: "Speaking", value: speakingPct },
  ].sort((a, b) => a.value - b.value);

  const weakestSkill = skills[0];

  // Weekly activity mock (TODO: заменить на реальные данные)
  const weekly = [
    { day: "Пн", value: 0.5 },
    { day: "Вт", value: 1.0 },
    { day: "Ср", value: 0.75 },
    { day: "Чт", value: 1.25 },
    { day: "Пт", value: 0.5 },
    { day: "Сб", value: 1.5 },
    { day: "Вс", value: 1.0 },
  ];
  const weeklyHours = Math.round(
    weekly.reduce((sum, d) => sum + d.value, 0) * 10
  ) / 10;
  const weeklyProgress =
    weekly[weekly.length - 1].value - weekly[weekly.length - 2].value;
  const weeklyProgressText =
    weeklyProgress >= 0
      ? `+${weeklyProgress.toFixed(2)}ч к вчера`
      : `${weeklyProgress.toFixed(2)}ч к вчера`;

  const progressBar = Math.max(
    0,
    Math.min(100, effectiveTotal > 0 ? (effectiveScore / effectiveTotal) * 100 : 0)
  );

  const handleStartPersonalizedPlan = () => {
    // Если ещё нет результата теста — сначала отправляем на диагностику
    if (!lastResult && !localTestResult) {
      router.push("/test");
      return;
    }
    // План отображается на /plan
    router.push("/plan");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-10 bg-bg-light">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Добро пожаловать,{" "}
              <span className="font-semibold text-gray-900">
                {user?.email}
              </span>
              {user?.goal ? (
                <>
                  {" "}
                  — цель:{" "}
                  <span className="font-semibold text-accent-start">
                    {user.goal}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/test"
              className="px-5 py-3 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 transition-all"
            >
              Retake Test
            </Link>
            <Link
              href="/training"
              className="px-5 py-3 border-2 border-accent-start text-accent-start rounded-xl font-semibold hover:bg-accent-start/5 hover:-translate-y-0.5 transition-all"
            >
              Start Daily Training
            </Link>
            <Link
              href="/plan"
              className="px-5 py-3 border border-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
            >
              View Learning Plan
            </Link>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            tone="accent"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20l9-5-9-5-9 5 9 5Z" />
                <path d="M12 12l9-5-9-5-9 5 9 5Z" />
              </svg>
            }
            label="Current Level"
            value={effectiveLevel}
            subtext={user?.level ? "из профиля + диагностика" : "по последней диагностике"}
          />
          <KpiCard
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path d="M12 7v5l3 3" />
              </svg>
            }
            label="Overall Score"
            value={`${overallPercent}%`}
            subtext={
              effectiveTotal
                ? `${effectiveScore}/${effectiveTotal} правильных`
                : "нет данных"
            }
          />
          <KpiCard
            tone={weakestSkill.value < 45 ? "bad" : "neutral"}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            }
            label="Weakest Skill"
            value={weakestSkill.label}
            subtext={`${weakestSkill.value}% — фокус на улучшение`}
          />
          <KpiCard
            tone={weeklyProgress >= 0 ? "good" : "neutral"}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3v18h18" />
                <path d="M7 14l3-3 4 4 6-6" />
              </svg>
            }
            label="Weekly Progress"
            value={`${weeklyHours}ч`}
            subtext={weeklyProgressText}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Skills Analytics
                </p>
                <p className="text-sm text-gray-500">
                  Проценты по навыкам (выделяем слабые и сильные зоны)
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {loading ? "Обновление..." : "Актуально"}
              </span>
            </div>

            <div className="space-y-4">
              {[
                { label: "Grammar", value: grammarPct },
                { label: "Vocabulary", value: vocabPct },
                { label: "Reading", value: readingPct },
                { label: "Listening", value: listeningPct },
                { label: "Writing", value: writingPct },
                { label: "Speaking", value: speakingPct },
              ].map((s) => (
                <SkillBar key={s.label} label={s.label} value={s.value} />
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Последний результат
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-accent-start">
                    {effectiveScore}/{effectiveTotal}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-accent-start/10 text-accent-start text-sm font-semibold">
                    {effectiveLevel}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-3 bg-white rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all"
                  style={{ width: `${progressBar}%` }}
                />
              </div>
              {!lastResult && loading ? (
                <p className="mt-3 text-sm text-gray-500">
                  Загрузка результатов из API...
                </p>
              ) : null}
              {!lastResult && !localTestResult ? (
                <p className="mt-3 text-sm text-gray-500">
                  Пока нет результатов — пройди тест, чтобы увидеть аналитику.
                </p>
              ) : null}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  AI Recommendations
                </p>
                <p className="text-sm text-gray-500">
                  Короткий план на ближайшие 7 дней
                </p>
              </div>
              <div className="rounded-xl p-3 bg-gradient-to-r from-accent-start to-accent-end text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.4 4.2-2.8 5.7-.7.7-1.2 1.6-1.2 2.6V19a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.7c0-1-.5-1.9-1.2-2.6C6.4 13.2 5 11.4 5 9a7 7 0 0 1 7-7Z" />
                </svg>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {weakestSkill.value < 45
                  ? `Фокус недели: прокачаем ${weakestSkill.label}. Делаем короткие, но регулярные сессии — так прогресс будет быстрее.`
                  : "Отлично! Давай закрепим уровень и аккуратно подтянем слабые зоны через ежедневную практику."}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <RecommendationRow
                title="Grammar topics"
                items={
                  grammarPct < 55
                    ? ["Articles", "Tenses", "Conditionals"]
                    : ["Passive Voice", "Word order", "Complex sentences"]
                }
              />
              <RecommendationRow
                title="Vocabulary topics"
                items={
                  vocabPct < 55
                    ? ["Everyday verbs", "Phrasal verbs", "Collocations"]
                    : ["Academic words", "Topic-specific sets", "Synonyms"]
                }
              />
              <RecommendationRow
                title="Exercises"
                items={[
                  "10 минут мини-тест",
                  "1 короткое письмо с фидбеком",
                  "5 минут speaking shadowing",
                ]}
              />
            </div>

            <Link
              href="/test"
              className="sr-only"
            >
              {/* скрытый Link только для SEO/пререндеринга, клики идут через onClick */}
              Start Personalized Plan
            </Link>
            <button
              onClick={handleStartPersonalizedPlan}
              className="mt-6 block w-full py-3.5 text-center bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 transition-all"
            >
              Start Personalized Plan
            </button>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="mt-6">
          <WeeklyActivityChart data={weekly} unit="ч" />
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex-1">
            <p className="text-sm font-semibold text-gray-900">Аккаунт</p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.email} {user?.level ? `· уровень: ${user.level}` : ""}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-6 py-4 rounded-xl border-2 border-rose-200 text-rose-600 font-semibold hover:bg-rose-50 hover:-translate-y-0.5 transition-all"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

function RecommendationRow({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-2">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-sm text-gray-700 shadow-sm"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
