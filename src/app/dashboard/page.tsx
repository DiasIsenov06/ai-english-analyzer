"use client";

import { useEffect, useMemo, useState } from "react";
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
  grammarScore?: number | null;
  vocabularyScore?: number | null;
  correctionScore?: number | null;
  strengths?: string[] | string | null;
  weaknesses?: string[] | string | null;
  createdAt: string;
};

type LocalTestResult = {
  score: number;
  total: number;
  level: string;
  grammarScore?: number;
  vocabularyScore?: number;
  correctionScore?: number;
  strengths?: string[];
  weaknesses?: string[];
};

type WeeklyPoint = {
  day: string;
  value: number;
};

type StudyActivitySession = {
  createdAt: string;
  metricsJson?: string | null;
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

  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [localTestResult, setLocalTestResult] = useState<LocalTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  const [weekly, setWeekly] = useState<WeeklyPoint[]>([
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("testResult");
      if (raw) {
        setLocalTestResult(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(userRaw);
        if (!parsedUser?.id) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/test-results?userId=${parsedUser.id}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.result) {
          setLatestResult(data.result);
        }
      } catch (e) {
        console.error("Failed to load latest test result:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, []);

  useEffect(() => {
    const fetchWeeklyActivity = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) return;

        const parsedUser = JSON.parse(userRaw);
        if (!parsedUser?.id) return;

        const res = await fetch(`/api/study-activity?userId=${parsedUser.id}`);
        if (!res.ok) return;

        const data = await res.json();
        const sessions: StudyActivitySession[] = data.sessions ?? [];

        const dayMap: Record<string, number> = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        };

        for (const session of sessions) {
          const date = new Date(session.createdAt);
          const day = date.toLocaleDateString("en-US", { weekday: "short" });

          let minutes = 0;

          try {
            const parsedMetrics =
              typeof session.metricsJson === "string"
                ? JSON.parse(session.metricsJson)
                : {};

            minutes = Number(parsedMetrics?.minutes ?? 0);
          } catch {
            minutes = 0;
          }

          if (dayMap[day] !== undefined) {
            dayMap[day] += minutes / 60;
          }
        }

        setWeekly([
          { day: "Mon", value: Number(dayMap.Mon.toFixed(2)) },
          { day: "Tue", value: Number(dayMap.Tue.toFixed(2)) },
          { day: "Wed", value: Number(dayMap.Wed.toFixed(2)) },
          { day: "Thu", value: Number(dayMap.Thu.toFixed(2)) },
          { day: "Fri", value: Number(dayMap.Fri.toFixed(2)) },
          { day: "Sat", value: Number(dayMap.Sat.toFixed(2)) },
          { day: "Sun", value: Number(dayMap.Sun.toFixed(2)) },
        ]);
      } catch (error) {
        console.error("Failed to load weekly activity:", error);
      }
    };

    fetchWeeklyActivity();
  }, []);

  const effectiveScore = latestResult?.score ?? localTestResult?.score ?? 0;
  const effectiveTotal = latestResult?.total ?? localTestResult?.total ?? 13;
  const effectiveLevel =
    latestResult?.level ?? localTestResult?.level ?? user?.level ?? "—";

  const grammarRaw =
    latestResult?.grammarScore ?? localTestResult?.grammarScore ?? 0;
  const vocabularyRaw =
    latestResult?.vocabularyScore ?? localTestResult?.vocabularyScore ?? 0;
  const correctionRaw =
    latestResult?.correctionScore ?? localTestResult?.correctionScore ?? 0;

  const overallPercent =
    effectiveTotal > 0 ? Math.round((effectiveScore / effectiveTotal) * 100) : 0;

  const grammarPct = Math.round((grammarRaw / 5) * 100);
  const vocabularyPct = Math.round((vocabularyRaw / 5) * 100);
  const correctionPct = Math.round((correctionRaw / 3) * 100);

  const measuredSkills = [
    { key: "grammar", label: "Grammar", value: grammarPct, raw: `${grammarRaw}/5` },
    { key: "vocabulary", label: "Vocabulary", value: vocabularyPct, raw: `${vocabularyRaw}/5` },
    { key: "correction", label: "Correction", value: correctionPct, raw: `${correctionRaw}/3` },
  ].sort((a, b) => a.value - b.value);

  const weakestSkill = measuredSkills[0];

  const lastTestDate = latestResult?.createdAt
    ? formatDate(latestResult.createdAt)
    : "No test yet";

  const parsedWeaknesses = useMemo(() => {
    const source = latestResult?.weaknesses ?? localTestResult?.weaknesses ?? [];
    if (Array.isArray(source)) return source;
    if (typeof source === "string") {
      try {
        const parsed = JSON.parse(source);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [latestResult?.weaknesses, localTestResult?.weaknesses]);

  const parsedStrengths = useMemo(() => {
    const source = latestResult?.strengths ?? localTestResult?.strengths ?? [];
    if (Array.isArray(source)) return source;
    if (typeof source === "string") {
      try {
        const parsed = JSON.parse(source);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [latestResult?.strengths, localTestResult?.strengths]);

  const recommendationData = getRecommendations(weakestSkill?.label, {
    grammarPct,
    vocabularyPct,
    correctionPct,
  });

  const weeklyHours =
    Math.round(weekly.reduce((sum, day) => sum + day.value, 0) * 10) / 10;

  const weeklyProgress =
    weekly.length >= 2
      ? weekly[weekly.length - 1].value - weekly[weekly.length - 2].value
      : 0;

  const weeklyProgressText =
    weeklyProgress >= 0
      ? `+${weeklyProgress.toFixed(2)}h vs previous day`
      : `${weeklyProgress.toFixed(2)}h vs previous day`;

  const handleStartPersonalizedPlan = () => {
    if (!latestResult && !localTestResult) {
      router.push("/test");
      return;
    }
    router.push("/plan");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-10 bg-bg-light">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Қош келдің,{" "}
              <span className="font-semibold text-gray-900">
                {user?.email}
              </span>
              {user?.goal ? (
                <>
                  {" "}
                  — мақсат:{" "}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            tone="accent"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20l9-5-9-5-9 5 9 5Z" />
                <path d="M12 12l9-5-9-5-9 5 9 5Z" />
              </svg>
            }
            label="Current Level"
            value={effectiveLevel}
            subtext="Based on latest diagnostic test"
          />

          <KpiCard
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path d="M12 7v5l3 3" />
              </svg>
            }
            label="Overall Score"
            value={`${overallPercent}%`}
            subtext={`${effectiveScore}/${effectiveTotal} correct`}
          />

          <KpiCard
            tone={weakestSkill?.value < 45 ? "bad" : "neutral"}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              </svg>
            }
            label="Weakest Skill"
            value={weakestSkill?.label ?? "—"}
            subtext={
              weakestSkill
                ? `${weakestSkill.raw} — main focus area`
                : "No data yet"
            }
          />

          <KpiCard
            tone={weeklyHours > 0 ? "good" : "neutral"}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18" />
                <path d="M7 14l3-3 4 4 6-6" />
              </svg>
            }
            label="Weekly Study Time"
            value={`${weeklyHours}h`}
            subtext={weeklyHours > 0 ? weeklyProgressText : "No study activity yet"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Skills Analytics
                </p>
                <p className="text-sm text-gray-500">
                  Only measured skills are shown here
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {loading ? "Updating..." : "Current"}
              </span>
            </div>

            <div className="space-y-4">
              {measuredSkills.map((skill) => (
                <SkillBar
                  key={skill.key}
                  label={`${skill.label} (${skill.raw})`}
                  value={skill.value}
                />
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Coming soon
              </p>
              <div className="flex flex-wrap gap-2">
                {["Reading", "Listening", "Writing", "Speaking"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-500"
                  >
                    {skill} — Not assessed yet
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Latest result
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
                  style={{ width: `${overallPercent}%` }}
                />
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Last test date: {lastTestDate}
              </div>

              {!latestResult && !localTestResult ? (
                <p className="mt-3 text-sm text-gray-500">
                  Әзірге нәтиже жоқ. Алдымен тест тапсырып шық.
                </p>
              ) : null}
            </div>

            {(parsedStrengths.length > 0 || parsedWeaknesses.length > 0) && (
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    Strengths
                  </p>
                  {parsedStrengths.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedStrengths.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-xl bg-white border border-green-200 text-sm text-green-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-700">No strong areas yet</p>
                  )}
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    Weaknesses
                  </p>
                  {parsedWeaknesses.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedWeaknesses.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-sm text-amber-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-amber-700">No weak areas detected</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  AI Recommendations
                </p>
                <p className="text-sm text-gray-500">
                  Based on your current measured results
                </p>
              </div>
              <div className="rounded-xl p-3 bg-gradient-to-r from-accent-start to-accent-end text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.4 4.2-2.8 5.7-.7.7-1.2 1.6-1.2 2.6V19a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1.7c0-1-.5-1.9-1.2-2.6C6.4 13.2 5 11.4 5 9a7 7 0 0 1 7-7Z" />
                </svg>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {recommendationData.summary}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <RecommendationRow title="Focus topics" items={recommendationData.topics} />
              <RecommendationRow title="Exercises" items={recommendationData.exercises} />
            </div>

            <button
              onClick={handleStartPersonalizedPlan}
              className="mt-6 block w-full py-3.5 text-center bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 transition-all"
            >
              Start Personalized Plan
            </button>
          </div>
        </div>

        <div className="mt-6">
          <WeeklyActivityChart data={weekly} unit="h" />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex-1">
            <p className="text-sm font-semibold text-gray-900">Account</p>
            <p className="text-sm text-gray-500 mt-1">
              {user?.email} {user?.level ? `· level: ${user.level}` : ""}
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getRecommendations(
  weakestSkillLabel: string | undefined,
  values: {
    grammarPct: number;
    vocabularyPct: number;
    correctionPct: number;
  }
) {
  if (!weakestSkillLabel) {
    return {
      summary:
        "Complete the diagnostic test first. Then the system will generate a focused plan based on your weak areas.",
      topics: ["Take test", "Save result", "View dashboard"],
      exercises: ["1 diagnostic test", "1 short practice", "Review weak areas"],
    };
  }

  if (weakestSkillLabel === "Grammar") {
    return {
      summary:
        values.grammarPct < 50
          ? "Your main focus now is Grammar. Start with the basics and practice short grammar drills every day."
          : "Grammar needs reinforcement. Keep practicing structured sentence patterns and common grammar rules.",
      topics: ["Articles", "Present Simple", "Prepositions"],
      exercises: ["10 grammar questions", "Fill-in-the-gap practice", "Sentence correction drill"],
    };
  }

  if (weakestSkillLabel === "Vocabulary") {
    return {
      summary:
        values.vocabularyPct < 50
          ? "Vocabulary is currently your weakest area. Build a strong base with common everyday words and verbs."
          : "Vocabulary needs a small boost. Focus on useful words and collocations in daily contexts.",
      topics: ["Everyday words", "Common verbs", "Basic collocations"],
      exercises: ["10 new words", "Match word and meaning", "Use words in sentences"],
    };
  }

  return {
    summary:
      values.correctionPct < 50
        ? "Sentence correction needs more attention. Practice noticing mistakes and rewriting sentences correctly."
        : "Correction skills are improving, but you still need regular error-detection practice.",
    topics: ["Sentence structure", "Word order", "Error correction"],
    exercises: ["Fix 5 sentences", "Reorder words", "Find the mistake"],
  };
}