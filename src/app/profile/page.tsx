"use client";

import { useEffect, useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type TestResult = {
  id: string;
  score: number;
  total: number;
  level: string;
  grammarScore?: number | null;
  vocabularyScore?: number | null;
  correctionScore?: number | null;
  strengths?: string | string[] | null;
  weaknesses?: string | string[] | null;
  createdAt: string;
};

const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

const LEVEL_COLOR: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-teal-100 text-teal-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-indigo-100 text-indigo-700",
  C1: "bg-violet-100 text-violet-700",
  C2: "bg-rose-100 text-rose-700",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/test/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const latest = results[0] ?? null;
  const bestScore = useMemo(
    () => (results.length ? Math.max(...results.map((r) => (r.score / r.total) * 100)) : 0),
    [results]
  );
  const avgScore = useMemo(
    () =>
      results.length
        ? Math.round(results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / results.length)
        : 0,
    [results]
  );

  const grammarPct  = latest ? Math.round(((latest.grammarScore ?? 0) / 5) * 100) : 0;
  const vocabPct    = latest ? Math.round(((latest.vocabularyScore ?? 0) / 5) * 100) : 0;
  const corrPct     = latest ? Math.round(((latest.correctionScore ?? 0) / 3) * 100) : 0;
  const overallPct  = latest ? Math.round((latest.score / latest.total) * 100) : 0;

  const joinedDate = useMemo(() => {
    if (!results.length) return null;
    const sorted = [...results].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return fmtDate(sorted[0].createdAt);
  }, [results]);

  const levelIdx = LEVEL_ORDER.indexOf(latest?.level ?? "");

  return (
    <div className="min-h-screen bg-bg-light px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Hero card ── */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent-start/20">
            <span className="text-3xl font-extrabold text-white">
              {user?.email?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-extrabold text-gray-900">{user?.email}</h1>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              {latest?.level && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${LEVEL_COLOR[latest.level] ?? "bg-gray-100 text-gray-700"}`}>
                  {latest.level} деңгей
                </span>
              )}
              {user?.goal && (
                <span className="text-xs px-3 py-1 rounded-full bg-accent-start/10 text-accent-start font-medium">
                  🎯 {user.goal}
                </span>
              )}
              {joinedDate && (
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                  📅 {joinedDate} бастап
                </span>
              )}
            </div>
          </div>

          <Link
            href="/test"
            className="px-5 py-2.5 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 transition-all"
          >
            Тест тапсыру
          </Link>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Тест саны",     value: results.length,            sub: "барлығы",        color: "text-accent-start" },
            { label: "Үздік нәтиже",  value: `${Math.round(bestScore)}%`, sub: "ең жоғары",    color: "text-green-600" },
            { label: "Орташа нәтиже", value: `${avgScore}%`,            sub: "барлық тесттер", color: "text-blue-600" },
            { label: "Ағымдағы деңгей",value: latest?.level ?? "—",    sub: "соңғы тест",     color: "text-violet-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Radar / Skills chart ── */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-900 mb-4">Дағдылар картасы</p>
            {latest ? (
              <SkillRadar
                skills={[
                  { label: "Grammar",    value: grammarPct },
                  { label: "Vocabulary", value: vocabPct },
                  { label: "Correction", value: corrPct },
                  { label: "Overall",    value: overallPct },
                ]}
              />
            ) : (
              <EmptyState text="Тест тапсырылмаған" />
            )}
          </div>

          {/* ── Level progression ── */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-900 mb-4">Деңгей прогресі</p>
            <LevelProgress currentLevel={latest?.level} />

            {/* Score trend mini chart */}
            {results.length > 1 && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Нәтиже динамикасы
                </p>
                <ScoreTrend results={results.slice(0, 8).reverse()} />
              </div>
            )}
          </div>
        </div>

        {/* ── Skill bars detailed ── */}
        {latest && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-900 mb-5">Дағдылар бойынша нәтиже</p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "Grammar",    pct: grammarPct,  raw: `${latest.grammarScore ?? 0}/5`,    color: "from-blue-400 to-blue-600" },
                { label: "Vocabulary", pct: vocabPct,    raw: `${latest.vocabularyScore ?? 0}/5`, color: "from-violet-400 to-violet-600" },
                { label: "Correction", pct: corrPct,     raw: `${latest.correctionScore ?? 0}/3`, color: "from-amber-400 to-amber-600" },
              ].map((sk) => (
                <div key={sk.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">{sk.label}</span>
                    <span className="text-sm font-bold text-gray-900">{sk.raw}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${sk.color} transition-all duration-700`}
                      style={{ width: `${sk.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{sk.pct}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Test history ── */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-bold text-gray-900 mb-4">Тест тарихы</p>
          {loading ? (
            <div className="text-center py-10 text-gray-400 text-sm">Жүктелуде...</div>
          ) : results.length === 0 ? (
            <EmptyState text="Тест тапсырылмаған" />
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100);
                return (
                  <div
                    key={r.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-gray-50 ${
                      i === 0 ? "border-accent-start/30 bg-accent-start/5" : "border-gray-100"
                    }`}
                  >
                    <span className="text-lg font-bold text-gray-300">#{results.length - i}</span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${LEVEL_COLOR[r.level] ?? "bg-gray-100 text-gray-700"}`}>
                          {r.level}
                        </span>
                        {i === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-accent-start/10 text-accent-start font-medium">
                            Соңғы
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            pct >= 75 ? "bg-green-400" : pct >= 50 ? "bg-blue-400" : "bg-amber-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-extrabold text-gray-900">{pct}%</p>
                      <p className="text-xs text-gray-400">{r.score}/{r.total}</p>
                      <p className="text-xs text-gray-300">{fmtDate(r.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick links ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/vocabulary", label: "📚 Сөздік",       sub: "A1–C2 сөздер" },
            { href: "/test",       label: "📝 Тест",          sub: "Деңгейді тексер" },
            { href: "/training",   label: "🎯 Жаттығу",       sub: "AI-мен жаттығ" },
            { href: "/dashboard",  label: "📊 Dashboard",     sub: "Статистика" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-gray-100 bg-white shadow-sm p-4 hover:border-accent-start/30 hover:bg-accent-start/5 hover:-translate-y-0.5 transition-all text-center"
            >
              <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{link.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Radar Chart (SVG) ──────────────────────────────────────────────────────
function SkillRadar({ skills }: { skills: { label: string; value: number }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 75;
  const n = skills.length;

  const points = skills.map((sk, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ratio = sk.value / 100;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
      lx: cx + (r + 22) * Math.cos(angle),
      ly: cy + (r + 22) * Math.sin(angle),
      label: sk.label,
      value: sk.value,
    };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Grid rings at 25%, 50%, 75%, 100%
  const gridRings = [0.25, 0.5, 0.75, 1].map((ratio) =>
    skills
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return `${cx + r * ratio * Math.cos(angle)},${cy + r * ratio * Math.sin(angle)}`;
      })
      .join(" ")
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridRings.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}
        {/* Axes */}
        {skills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
          );
        })}
        {/* Data polygon */}
        <polygon
          points={polygon}
          fill="url(#radarGrad)"
          stroke="#4F7CFF"
          strokeWidth={2}
          fillOpacity={0.35}
        />
        <defs>
          <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4F7CFF" />
            <stop offset="100%" stopColor="#6AE3FF" />
          </linearGradient>
        </defs>
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#4F7CFF" />
        ))}
        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="#6b7280"
            fontWeight="600"
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {skills.map((sk) => (
          <div key={sk.label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-accent-start to-accent-end flex-shrink-0" />
            <span className="text-xs text-gray-600 flex-1">{sk.label}</span>
            <span className="text-xs font-bold text-gray-900">{sk.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Level Progression ─────────────────────────────────────────────────────
function LevelProgress({ currentLevel }: { currentLevel?: string }) {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const idx = levels.indexOf(currentLevel ?? "");
  return (
    <div className="flex items-center gap-1">
      {levels.map((lvl, i) => (
        <div key={lvl} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < idx
                  ? "bg-gradient-to-r from-accent-start to-accent-end text-white shadow-sm"
                  : i === idx
                  ? "bg-gradient-to-r from-accent-start to-accent-end text-white shadow-lg shadow-accent-start/30 scale-110"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < idx ? "✓" : lvl.slice(-1)}
            </div>
            <span className={`text-xs mt-1 font-medium ${i === idx ? "text-accent-start" : "text-gray-400"}`}>
              {lvl}
            </span>
          </div>
          {i < levels.length - 1 && (
            <div className={`h-0.5 flex-1 mx-0.5 mb-4 rounded-full ${i < idx ? "bg-accent-start" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Score Trend mini chart ────────────────────────────────────────────────
function ScoreTrend({ results }: { results: TestResult[] }) {
  const scores = results.map((r) => Math.round((r.score / r.total) * 100));
  const max = Math.max(...scores, 1);
  const w = 240;
  const h = 60;
  const step = w / (scores.length - 1 || 1);

  const pts = scores.map((s, i) => `${i * step},${h - (s / max) * (h - 8)}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F7CFF" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#4F7CFF" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`0,${h} ${pts} ${(scores.length - 1) * step},${h}`}
        fill="url(#trendGrad)"
      />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        stroke="#4F7CFF"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dots + labels */}
      {scores.map((s, i) => (
        <g key={i}>
          <circle cx={i * step} cy={h - (s / max) * (h - 8)} r={3} fill="#4F7CFF" />
          <text
            x={i * step}
            y={h - (s / max) * (h - 8) - 6}
            textAnchor="middle"
            fontSize={8}
            fill="#6b7280"
          >
            {s}%
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────
function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-10 text-gray-400">
      <p className="text-3xl mb-2">📋</p>
      <p className="text-sm">{text}</p>
      <Link
        href="/test"
        className="mt-3 inline-block text-xs text-accent-start hover:underline"
      >
        Тест тапсыру →
      </Link>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("kk-KZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
