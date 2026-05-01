"use client";

import { useState, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  VOCAB_WORDS,
  LEVELS,
  LEVEL_COLORS,
  LEVEL_DESCRIPTIONS,
  type Level,
  type VocabWord,
} from "@/data/vocabularyData";

export default function VocabularyPage() {
  return (
    <ProtectedRoute>
      <VocabularyContent />
    </ProtectedRoute>
  );
}

type Lang = "kz" | "ru" | "both";

function VocabularyContent() {
  const [activeLevel, setActiveLevel] = useState<Level | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<Lang>("both");
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [learned, setLearned] = useState<Record<number, boolean>>({});
  const [mode, setMode] = useState<"cards" | "list">("cards");

  const filtered = useMemo(() => {
    let words = VOCAB_WORDS;
    if (activeLevel !== "ALL") words = words.filter((w) => w.level === activeLevel);
    if (search.trim()) {
      const q = search.toLowerCase();
      words = words.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.kz.toLowerCase().includes(q) ||
          w.ru.toLowerCase().includes(q)
      );
    }
    return words;
  }, [activeLevel, search]);

  const learnedCount = Object.values(learned).filter(Boolean).length;
  const totalCount = VOCAB_WORDS.length;

  const countByLevel = useMemo(() => {
    const map: Record<string, number> = {};
    VOCAB_WORDS.forEach((w) => {
      map[w.level] = (map[w.level] || 0) + 1;
    });
    return map;
  }, []);

  const toggleFlip = (id: number) =>
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleLearn = (id: number) =>
    setLearned((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-bg-light px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            📚 Vocabulary
          </h1>
          <p className="mt-2 text-gray-500">
            A1-тен C2-ге дейін — қазақша және орысша аудармамен ·{" "}
            <span className="text-accent-start font-semibold">
              {learnedCount}/{totalCount}
            </span>{" "}
            үйренілді
          </p>

          {/* Overall progress bar */}
          <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-start to-accent-end transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (learnedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* ── Level stats row ── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {LEVELS.map((lvl) => {
            const learnedInLevel = VOCAB_WORDS.filter(
              (w) => w.level === lvl && learned[w.id]
            ).length;
            const total = countByLevel[lvl] || 0;
            return (
              <div
                key={lvl}
                className={`rounded-xl p-3 border text-center cursor-pointer transition-all hover:-translate-y-0.5 ${
                  activeLevel === lvl
                    ? "border-accent-start bg-accent-start/5 shadow-sm"
                    : "border-gray-100 bg-white"
                }`}
                onClick={() => setActiveLevel(activeLevel === lvl ? "ALL" : lvl)}
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${LEVEL_COLORS[lvl]}`}>
                  {lvl}
                </span>
                <p className="text-lg font-bold text-gray-900 mt-1">{total}</p>
                <p className="text-xs text-gray-400">{learnedInLevel} үйренді</p>
                <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-start to-accent-end"
                    style={{ width: `${total > 0 ? (learnedInLevel / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Іздеу — ағылшынша, қазақша, орысша..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-start/30 text-sm"
            />
          </div>

          {/* Lang toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["both", "kz", "ru"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  lang === l ? "bg-white shadow text-accent-start" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {l === "both" ? "KZ + RU" : l === "kz" ? "Қазақша" : "Русский"}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["cards", "list"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? "bg-white shadow text-accent-start" : "text-gray-500"
                }`}
              >
                {m === "cards" ? "🃏 Карта" : "📋 Тізім"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Level title ── */}
        {activeLevel !== "ALL" && (
          <div className={`mb-5 px-4 py-3 rounded-xl border ${LEVEL_COLORS[activeLevel]}`}>
            <span className="font-bold text-sm">{activeLevel}</span>
            <span className="mx-2">·</span>
            <span className="text-sm">{LEVEL_DESCRIPTIONS[activeLevel].en}</span>
            <span className="mx-2">·</span>
            <span className="text-sm">{LEVEL_DESCRIPTIONS[activeLevel].kz}</span>
            <span className="mx-2">·</span>
            <span className="text-sm">{LEVEL_DESCRIPTIONS[activeLevel].ru}</span>
          </div>
        )}

        {/* ── Results count ── */}
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} сөз табылды
        </p>

        {/* ── Cards mode ── */}
        {mode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((word) => (
              <FlashCard
                key={word.id}
                word={word}
                lang={lang}
                flipped={!!flipped[word.id]}
                learned={!!learned[word.id]}
                onFlip={() => toggleFlip(word.id)}
                onLearn={() => toggleLearn(word.id)}
              />
            ))}
          </div>
        ) : (
          /* ── List mode ── */
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Сөз</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Транскрипция</th>
                  {(lang === "kz" || lang === "both") && (
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Қазақша 🇰🇿</th>
                  )}
                  {(lang === "ru" || lang === "both") && (
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Русский 🇷🇺</th>
                  )}
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Деңгей</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((word) => (
                  <tr
                    key={word.id}
                    className={`hover:bg-gray-50 transition-colors ${learned[word.id] ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">{word.word}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{word.transcription}</td>
                    {(lang === "kz" || lang === "both") && (
                      <td className="px-4 py-3 text-gray-700">{word.kz}</td>
                    )}
                    {(lang === "ru" || lang === "both") && (
                      <td className="px-4 py-3 text-gray-700">{word.ru}</td>
                    )}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${LEVEL_COLORS[word.level]}`}>
                        {word.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleLearn(word.id)}
                        className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                          learned[word.id]
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-green-200 hover:text-green-600"
                        }`}
                      >
                        {learned[word.id] ? "✓ Үйрендім" : "Үйрену"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-semibold">Сөз табылмады</p>
            <p className="text-sm">Басқа сөзді іздеп көріңіз</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashCard({
  word,
  lang,
  flipped,
  learned,
  onFlip,
  onLearn,
}: {
  word: VocabWord;
  lang: Lang;
  flipped: boolean;
  learned: boolean;
  onFlip: () => void;
  onLearn: () => void;
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-white shadow-sm overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
        learned ? "border-green-200 bg-green-50/30" : "border-gray-100"
      }`}
      style={{ minHeight: 180 }}
      onClick={onFlip}
    >
      {/* Level badge */}
      <div className="absolute top-3 left-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${LEVEL_COLORS[word.level]}`}>
          {word.level}
        </span>
      </div>

      {/* Learned badge */}
      {learned && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="p-5 pt-10">
        {!flipped ? (
          /* Front — English */
          <>
            <p className="text-xl font-bold text-gray-900">{word.word}</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{word.transcription}</p>
            <p className="text-xs text-gray-400 mt-3 italic line-clamp-2">&ldquo;{word.example}&rdquo;</p>
            <p className="text-xs text-gray-300 mt-3 text-center">Аударманы көру үшін басыңыз →</p>
          </>
        ) : (
          /* Back — Translations */
          <>
            <p className="text-base font-bold text-gray-900 mb-3">{word.word}</p>
            {(lang === "kz" || lang === "both") && (
              <div className="flex items-start gap-2 mb-2">
                <span className="text-base">🇰🇿</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Қазақша</p>
                  <p className="text-sm font-semibold text-gray-800">{word.kz}</p>
                </div>
              </div>
            )}
            {(lang === "ru" || lang === "both") && (
              <div className="flex items-start gap-2 mb-2">
                <span className="text-base">🇷🇺</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Русский</p>
                  <p className="text-sm font-semibold text-gray-800">{word.ru}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2 italic line-clamp-2">&ldquo;{word.example}&rdquo;</p>
          </>
        )}
      </div>

      {/* Learn button — stops propagation */}
      <div
        className="border-t border-gray-50 px-5 py-2.5 flex justify-between items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-gray-400">{word.topic}</span>
        <button
          onClick={onLearn}
          className={`text-xs px-3 py-1 rounded-lg border transition-all ${
            learned
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-gray-50 border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600"
          }`}
        >
          {learned ? "✓ Үйрендім" : "+ Үйрену"}
        </button>
      </div>
    </div>
  );
}
