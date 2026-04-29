"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import VocabularyFlashcard from "@/components/VocabularyFlashcard";

type StudyTask = {
  id: string;
  type: string;
  title: string;
  contentJson: string;
  status: string;
  orderIndex: number;
};

type PlanDay = {
  id: string;
  dayIndex: number;
  date: string;
  status: string;
  dataJson: string;
  tasks: StudyTask[];
};

type ApiResponse = {
  day: PlanDay | null;
};

export default function DailyPlanDayPage({
  params,
}: {
  params: { dayId: string };
}) {
  return (
    <ProtectedRoute>
      <DailyPlanDayContent dayId={params.dayId} />
    </ProtectedRoute>
  );
}

function DailyPlanDayContent({ dayId }: { dayId: string }) {
  const [day, setDay] = useState<PlanDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");

  const [selectedWord, setSelectedWord] = useState<any>(null);

  const fetchDay = async () => {
    try {
      setLoading(true);
      setError("");

      const userRaw = localStorage.getItem("user");
      if (!userRaw) {
        setError("User not found.");
        return;
      }

      const user = JSON.parse(userRaw);

      const res = await fetch(`/api/plan/day/${dayId}?userId=${user.id}`);
      const data: ApiResponse = await res.json();

      if (!res.ok || !data.day) {
        setError("Day lesson not found.");
        setDay(null);
        return;
      }

      setDay(data.day);
    } catch (e) {
      console.error("Load day error:", e);
      setError("Failed to load lesson.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDay();
  }, [dayId]);

  const tasks = useMemo(() => {
    return [...(day?.tasks ?? [])].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [day?.tasks]);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const handleCompleteDay = async () => {
    if (!day) return;

    try {
      setCompleting(true);

      const res = await fetch(`/api/plan/day/${dayId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayId: day.id,
          status: "completed",
        }),
      });

      if (!res.ok) {
        setError("Could not complete this day.");
        return;
      }

      await fetchDay();
    } catch (e) {
      console.error("Complete day error:", e);
      setError("Could not complete this day.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading lesson...</p>
      </div>
    );
  }

  if (error || !day) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-100 rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Lesson not found</h1>
          <p className="mt-3 text-gray-500">{error}</p>
          <Link
            href="/daily-plan"
            className="mt-6 inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold"
          >
            Back to plan
          </Link>
        </div>
      </div>
    );
  }

  const displayDay = day.dayIndex === 0 ? 1 : day.dayIndex;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 via-white to-sky-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/daily-plan" className="text-sm font-semibold text-accent-start hover:underline">
            ← Back to Daily Plan
          </Link>
        </div>

        <div className="rounded-[32px] bg-white border border-sky-100 shadow-xl overflow-hidden mb-8">
          <div className="p-8 md:p-10 bg-gradient-to-r from-sky-50 via-white to-indigo-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <span className="inline-flex px-4 py-2 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                  Structured Lesson
                </span>

                <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-gray-900">
                  Day {displayDay} Lesson
                </h1>

                <p className="mt-3 text-gray-600">
                  Vocabulary, grammar and correction practice for today.
                </p>
              </div>

              <div className="w-full lg:w-80 rounded-3xl bg-white border border-gray-100 shadow-sm p-6">
                <p className="text-sm font-semibold text-gray-900">Today Progress</p>
                <p className="mt-2 text-4xl font-extrabold text-gray-900">{progress}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {completedTasks} of {tasks.length} tasks completed
                </p>

                <div className="mt-4 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <button
                  onClick={handleCompleteDay}
                  disabled={completing || day.status === "completed"}
                  className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-accent-start to-accent-end text-white font-semibold disabled:opacity-60 hover:shadow-lg transition"
                >
                  {day.status === "completed"
                    ? "Completed"
                    : completing
                    ? "Saving..."
                    : "Complete Day"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] bg-white border border-gray-100 shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900">Lesson Structure</h2>

              <div className="mt-5 space-y-3">
                <SideItem title="Vocabulary" text="Learn and review today’s words." />
                <SideItem title="Grammar" text="Understand the rule with examples." />
                <SideItem title="Correction" text="Fix mistakes and build accuracy." />
              </div>
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-100 shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900">AI Tutor Tip</h2>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                Егер бір тақырып түсініксіз болса, AI Tutor бетіне өтіп,
                “Explain this for A1 level” деп сұра. Кейін бұл lesson ішінде
                бірден AI көмек қосамыз.
              </p>

              <Link
                href="/training"
                className="mt-5 block text-center py-3 rounded-2xl bg-white border border-sky-100 text-sky-700 font-semibold hover:bg-sky-50 transition"
              >
                Open AI Tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: StudyTask }) {
  const content = parseContent(task.contentJson);

  if (task.type === "vocabulary") {
    const words = Array.isArray(content.words) ? content.words : [];

    return (
      <div className="rounded-[28px] bg-white border border-gray-100 shadow-lg p-6 md:p-8">
        <TaskHeader type="Vocabulary" title={task.title} />

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {words.map((word: string, index: number) => (
            <div
              key={`${word}-${index}`}
              className="rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-4 hover:-translate-y-1 hover:shadow-md transition"
            >
              <p className="text-xs text-sky-600 font-semibold">Word {index + 1}</p>
              <p className="mt-1 text-xl font-extrabold text-gray-900">{word}</p>
              <p className="mt-2 text-sm text-gray-500">Tap later for flashcard mode</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (task.type === "grammar") {
    const examples = Array.isArray(content.examples) ? content.examples : [];

    return (
      <div className="rounded-[28px] bg-white border border-gray-100 shadow-lg p-6 md:p-8">
        <TaskHeader type="Grammar" title={task.title} />

        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-5">
          <p className="text-sm font-semibold text-gray-500 uppercase">Rule</p>
          <p className="mt-2 text-gray-800 leading-relaxed">
            {String(content.explanation ?? "No explanation yet.")}
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">Examples</p>
          <div className="space-y-3">
            {examples.map((ex: string, index: number) => (
              <div key={index} className="rounded-2xl bg-white border border-gray-100 px-5 py-4 shadow-sm">
                <p className="text-gray-800">{ex}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (task.type === "correction") {
    const sentences = Array.isArray(content.sentences) ? content.sentences : [];

    return (
      <div className="rounded-[28px] bg-white border border-gray-100 shadow-lg p-6 md:p-8">
        <TaskHeader type="Correction" title={task.title} />

        <div className="mt-6 space-y-3">
          {sentences.map((sentence: string, index: number) => (
            <div key={index} className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
              <p className="text-xs font-semibold text-amber-700">Sentence {index + 1}</p>
              <p className="mt-1 text-gray-900 font-medium">{sentence}</p>
              <input
                className="mt-3 w-full px-4 py-3 rounded-xl border border-amber-100 bg-white outline-none focus:ring-2 focus:ring-amber-200"
                placeholder="Write the corrected version..."
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] bg-white border border-gray-100 shadow-lg p-6 md:p-8">
      <TaskHeader type={task.type} title={task.title} />
      <pre className="mt-5 text-sm bg-gray-50 rounded-2xl p-4 overflow-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
}

function TaskHeader({ type, title }: { type: string; title: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <span className="inline-flex px-3 py-1 rounded-full bg-accent-start/10 text-accent-start text-xs font-bold uppercase tracking-wide">
          {type}
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-gray-900">{title}</h2>
      </div>
    </div>
  );
}

function SideItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{text}</p>
    </div>
  );
}

function parseContent(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}