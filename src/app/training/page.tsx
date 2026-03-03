"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

type Session = {
  id: string;
  status: string;
  messages: Message[];
};

export default function TrainingPage() {
  return (
    <ProtectedRoute>
      <TrainingContent />
    </ProtectedRoute>
  );
}

function TrainingContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const start = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/training/session/start", {
          method: "POST",
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });
        if (!res.ok) throw new Error("Failed to start session");
        const data = (await res.json()) as Session;
        setSession(data);
        setTimeout(scrollToBottom, 50);
      } catch (e) {
        console.error(e);
        setError("Не удалось запустить тренировку");
      } finally {
        setLoading(false);
      }
    };
    void start();
  }, []);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!session || !input.trim()) return;
    setSending(true);
    setError(null);
    const content = input.trim();
    setInput("");
    try {
      const optimistic: Session = {
        ...session,
        messages: [
          ...session.messages,
          {
            id: `local-${Date.now()}`,
            role: "user",
            content,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      setSession(optimistic);
      setTimeout(scrollToBottom, 50);

      const token = localStorage.getItem("token");
      const res = await fetch(`/api/training/session/${session.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const data = (await res.json()) as Session;
      setSession(data);
      setTimeout(scrollToBottom, 50);
    } catch (e) {
      console.error(e);
      setError("Не удалось отправить сообщение");
    } finally {
      setSending(false);
    }
  };

  const handleFinish = async () => {
    if (!session) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/training/session/${session.id}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          metrics: { finishedAt: new Date().toISOString() },
        }),
      });
      setSession((prev) => (prev ? { ...prev, status: "completed" } : prev));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-10 bg-bg-light">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Daily Training
              </p>
              <p className="text-xs text-gray-500">
                AI-тренер: warm-up, grammar, vocab и mini-task
              </p>
            </div>
            {session?.status === "completed" ? (
              <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                Completed
              </span>
            ) : (
              <button
                onClick={handleFinish}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Finish session
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading && <p className="text-gray-500 text-sm">Загрузка...</p>}
            {error && (
              <p className="text-red-500 text-xs mb-2">{error}</p>
            )}
            {session?.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-accent-start text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="px-4 py-3 border-t border-gray-100 flex items-center gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите ответ на задание..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-start/40"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-start to-accent-end text-white text-sm font-semibold disabled:opacity-60"
            >
              Отправить
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Today's tasks
          </p>
          <p className="text-xs text-gray-500 mb-4">
            План дня формируется на основе плана и слабых навыков. Сейчас
            используется mock-логика без реального LLM.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
              Warm-up: answer 2–3 simple questions about your day.
            </li>
            <li className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
              Grammar: 5 sentences to fix using Present Simple / Present
              Continuous.
            </li>
            <li className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
              Vocabulary: use 5 new words in your own sentences.
            </li>
            <li className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
              Mini-task: short writing (3–4 sentences) with feedback from AI.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

