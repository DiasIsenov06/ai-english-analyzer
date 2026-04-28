"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

type PlanDay = {
  id: string;
  dayIndex: number;
  date: string;
  status: string;
  dataJson: string;
};

type CurrentPlanResponse = {
  plan: {
    id: string;
    metaJson: string;
    createdAt: string;
    days: PlanDay[];
  } | null;
};

type ParsedMeta = {
  level?: string;
  goal?: string | null;
  weakFocus?: string;
  duration_days?: number;
  source?: string;
};

export default function DailyPlanPage() {
  return (
    <ProtectedRoute>
      <DailyPlanContent />
    </ProtectedRoute>
  );
}

function DailyPlanContent() {
  const [plan, setPlan] = useState<CurrentPlanResponse["plan"]>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrentPlan = async () => {
    try {
      setLoading(true);
      setError("");

      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        setError("User not found in local storage.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userRaw);
      if (!user?.id) {
        setError("User id not found.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/plan/current?userId=${user.id}`);
      const data: CurrentPlanResponse = await res.json();

      if (!res.ok) {
        setError("Failed to load study plan.");
        setPlan(null);
        setLoading(false);
        return;
      }

      setPlan(data.plan);
    } catch (e) {
      console.error("Load current plan error:", e);
      setError("Failed to load study plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      setError("");

      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        setError("User not found in local storage.");
        setGenerating(false);
        return;
      }

      const user = JSON.parse(userRaw);
      if (!user?.id) {
        setError("User id not found.");
        setGenerating(false);
        return;
      }

      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to generate plan.");
        setGenerating(false);
        return;
      }

      await fetchCurrentPlan();
    } catch (e) {
      console.error("Generate plan error:", e);
      setError("Failed to generate plan.");
    } finally {
      setGenerating(false);
    }
  };

  const parsedMeta: ParsedMeta = useMemo(() => {
    if (!plan?.metaJson) return {};
    try {
      return JSON.parse(plan.metaJson);
    } catch {
      return {};
    }
  }, [plan?.metaJson]);

  const sortedDays = useMemo(() => {
    if (!plan?.days) return [];
    return [...plan.days].sort((a, b) => a.dayIndex - b.dayIndex);
  }, [plan?.days]);

  const completedDays = sortedDays.filter((d) => d.status === "completed").length;
  const totalDays = sortedDays.length;
  const progressPercent =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  const currentDay =
    sortedDays.find((d) => d.status === "pending") ||
    sortedDays.find((d) => d.status === "in_progress") ||
    null;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white shadow-xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50 via-white to-indigo-50 opacity-90" />
          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 p-8 md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-5">
                Structured Learning System
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Your Daily Study Plan
              </h1>

              <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
                Бұл жерде сенің деңгейің мен әлсіз тұстарыңа негізделген нақты
                күндік оқу жоспары тұрады. Әр күнде vocabulary, grammar және
                correction тапсырмалары болады.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <InfoChip
                  label="Level"
                  value={parsedMeta.level || "A1"}
                />
                <InfoChip
                  label="Goal"
                  value={parsedMeta.goal || "General English"}
                />
                <InfoChip
                  label="Main focus"
                  value={parsedMeta.weakFocus || "Grammar"}
                />
                <InfoChip
                  label="Duration"
                  value={`${parsedMeta.duration_days || 7} days`}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white/90 backdrop-blur p-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Plan Progress
              </p>

              <p className="text-4xl font-extrabold text-gray-900">
                {progressPercent}%
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {completedDays} of {totalDays || 7} days completed
              </p>

              <div className="mt-4 h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Current day
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {currentDay ? `Day ${currentDay.dayIndex}` : "No active day"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {currentDay
                    ? formatDate(currentDay.date)
                    : "Generate a plan to begin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!plan && !loading ? (
          <div className="rounded-[28px] border border-gray-100 bg-white shadow-lg p-8 md:p-10 text-center">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-r from-accent-start to-accent-end text-white flex items-center justify-center shadow-lg mb-5">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 3v18" />
                <path d="M3 12h18" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your personalized plan is not created yet
            </h2>

            <p className="mt-3 text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Generate your structured learning path based on your diagnostic
              result. The system will prepare daily vocabulary, grammar and
              correction tasks for you.
            </p>

            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="mt-7 px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 disabled:opacity-70 transition-all"
            >
              {generating ? "Generating..." : "Generate My Study Plan"}
            </button>

            {error ? (
              <p className="mt-4 text-sm text-rose-600">{error}</p>
            ) : null}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] border border-gray-100 bg-white shadow-lg p-10 text-center">
            <p className="text-gray-500 animate-pulse">Loading study plan...</p>
          </div>
        ) : null}

        {plan ? (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="rounded-[28px] border border-gray-100 bg-white shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Daily Plan Timeline
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete each day in order and build consistent progress.
                  </p>
                </div>

                <span className="px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-sm font-semibold border border-sky-100">
                  {totalDays} days
                </span>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedDays.map((day) => (
                  <Link
                    key={day.id}
                    href={`/daily-plan/${day.dayIndex}`}
                    className={`group rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 ${
                      day.status === "completed"
                        ? "border-emerald-200 bg-emerald-50/70"
                        : currentDay?.id === day.id
                        ? "border-sky-200 bg-sky-50/80"
                        : "border-gray-100 bg-white hover:border-sky-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Day</p>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                          {day.dayIndex}
                        </h3>
                      </div>

                      <DayStatusBadge
                        status={
                          day.status === "completed"
                            ? "completed"
                            : currentDay?.id === day.id
                            ? "current"
                            : "pending"
                        }
                      />
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                      {formatDate(day.date)}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Open day lesson
                      </span>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-sky-600 transition"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-gray-100 bg-white shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Plan Summary
                </p>

                <div className="space-y-3">
                  <SummaryRow label="Level" value={parsedMeta.level || "A1"} />
                  <SummaryRow label="Goal" value={parsedMeta.goal || "General"} />
                  <SummaryRow label="Weak focus" value={parsedMeta.weakFocus || "Grammar"} />
                  <SummaryRow
                    label="Created"
                    value={formatDate(plan.createdAt)}
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-gray-100 bg-white shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  What each day includes
                </p>

                <div className="space-y-3">
                  <MiniBlock
                    title="10 vocabulary words"
                    text="Useful daily words adapted to your level."
                  />
                  <MiniBlock
                    title="1 grammar lesson"
                    text="Short explanation with examples."
                  />
                  <MiniBlock
                    title="1 correction task"
                    text="Fix mistakes and strengthen sentence building."
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Smart Note
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  For now, the plan is generated with structured logic based on
                  your level and weak area. Later we will upgrade it with a full
                  AI agent for deeper personalization.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">
        {value}
      </span>
    </div>
  );
}

function MiniBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{text}</p>
    </div>
  );
}

function DayStatusBadge({
  status,
}: {
  status: "completed" | "current" | "pending";
}) {
  if (status === "completed") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        Completed
      </span>
    );
  }

  if (status === "current") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
        Current
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
      Pending
    </span>
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