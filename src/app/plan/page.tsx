"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

type Plan = {
  id: string;
  metaJson: string;
};

type PlanDay = {
  id: string;
  dayIndex: number;
  date: string;
  dataJson: string;
  status: string;
  notes: string | null;
};

type DecodedMeta = {
  level: string;
  goal?: string | null;
  startDate: string;
  durationDays: number;
};

type DecodedDay = {
  focus: string;
  blocks: {
    type: string;
    title: string;
    description: string;
    estimatedMinutes: number;
  }[];
};

export default function PlanPage() {
  return (
    <ProtectedRoute>
      <PlanContent />
    </ProtectedRoute>
  );
}

function PlanContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [days, setDays] = useState<PlanDay[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/plan/current", {
        cache: "no-store",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });
      if (!res.ok) {
        throw new Error("Не удалось загрузить план");
      }
      const data = (await res.json()) as { plan: Plan | null; days: PlanDay[] };
      setPlan(data.plan);
      setDays(data.days ?? []);
    } catch (e) {
      console.error(e);
      setError("Не удалось загрузить план");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlan();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/plan/generate", {
        method: "POST",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      });
      if (!res.ok) {
        throw new Error("Ошибка генерации плана");
      }
      await loadPlan();
    } catch (e) {
      console.error(e);
      setError("Не удалось сгенерировать план");
    } finally {
      setGenerating(false);
    }
  };

  const updateDayStatus = async (dayId: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/plan/day/${dayId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const updated = (await res.json()) as PlanDay;
      setDays((prev) => prev.map((d) => (d.id === dayId ? updated : d)));
    } catch {
      // ignore
    }
  };

  const decodedMeta: DecodedMeta | null =
    plan && plan.metaJson ? JSON.parse(plan.metaJson) : null;

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-10 bg-bg-light">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Personalized Study Plan
            </h1>
            <p className="mt-2 text-gray-600">
              План обучения для{" "}
              <span className="font-semibold text-gray-900">
                {user?.email}
              </span>
              {decodedMeta?.level ? (
                <>
                  {" "}
                  · уровень:{" "}
                  <span className="font-semibold text-accent-start">
                    {decodedMeta.level}
                  </span>
                </>
              ) : null}
              {decodedMeta?.goal ? (
                <>
                  {" "}
                  · цель:{" "}
                  <span className="font-semibold text-accent-start">
                    {decodedMeta.goal}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-5 py-3 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {plan ? "Regenerate Plan" : "Generate Plan"}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Загрузка плана...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : !plan ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-gray-700 font-semibold mb-2">
              Персональный план ещё не создан
            </p>
            <p className="text-gray-500 mb-4">
              Нажми &laquo;Generate Plan&raquo;, чтобы AI собрал программу на
              ближайшие 4 недели.
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 transition-all disabled:opacity-60"
            >
              {generating ? "Генерация..." : "Generate Plan"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day) => {
              const decoded: DecodedDay = JSON.parse(day.dataJson);
              const date = new Date(day.date);
              const isToday =
                new Date().toDateString() === date.toDateString();
              const statusColor =
                day.status === "done"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : day.status === "skipped"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-gray-50 text-gray-600 border-gray-200";

              return (
                <div
                  key={day.id}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex flex-col md:flex-row md:items-start gap-4"
                >
                  <div className="w-full md:w-40 shrink-0">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Day {day.dayIndex + 1}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {date.toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                    {isToday ? (
                      <span className="inline-flex mt-2 px-2 py-1 text-xs font-semibold rounded-lg bg-accent-start/10 text-accent-start">
                        Today
                      </span>
                    ) : null}
                    <span
                      className={`mt-2 inline-flex px-2 py-1 text-xs font-semibold rounded-lg border ${statusColor}`}
                    >
                      {day.status}
                    </span>
                    <div className="mt-3 space-x-1">
                      <button
                        onClick={() => updateDayStatus(day.id, "done")}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Mark done
                      </button>
                      <button
                        onClick={() => updateDayStatus(day.id, "skipped")}
                        className="text-xs text-amber-600 hover:underline"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      {decoded.focus}
                    </p>
                    <ul className="space-y-2">
                      {decoded.blocks.map((b, idx) => (
                        <li
                          key={idx}
                          className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 text-sm text-gray-700"
                        >
                          <span className="font-semibold text-gray-900">
                            [{b.type}] {b.title}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            · ~{b.estimatedMinutes} мин
                          </span>
                          <div className="mt-1 text-gray-700">
                            {b.description}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

