"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Как работает обратная связь?",
      a: "Короткий тест проверяется по ответам, а план учитывает слабую тему. В тренировке можно включить внешние AI-подсказки, если сервис доступен. Спорный совет стоит проверить с преподавателем.",
    },
    {
      q: "Можно ли тренировать устную речь?",
      a: "Сейчас доступны письменные упражнения для разговорной практики. Автоматической оценки голоса и произношения в этой версии нет.",
    },
    {
      q: "Подходит ли для IELTS?",
      a: "Упражнения помогают практиковать английский, но не заменяют официальный IELTS и не предсказывают band score.",
    },
    {
      q: "Можно ли начать с нуля?",
      a: "Да. Начните с короткого теста и базовых упражнений. Тест даёт ориентир A1–B2, а не официальный сертификат; план рассчитан на 28 дней.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(79,124,255,0.08)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(106,227,255,0.06)_0%,transparent_70%)] rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(79,124,255,0.08)] border border-[rgba(79,124,255,0.2)] text-[#4F7CFF] text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#4F7CFF] animate-pulse" />
              Диагностика, практика и персональный план
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Найди свои слабые темы в английском с помощью{" "}
              <span className="bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] bg-clip-text text-transparent">
                English Analyzer
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Короткий тест, анализ ответов и план на 28 дней. Учитесь в своём темпе; основные упражнения доступны без внешнего AI. <strong className="text-[#4F7CFF]">100% бесплатно</strong>.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                href={user ? "/test" : "/register"}
                className="px-8 py-4 bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4F7CFF]/30 hover:-translate-y-1 transition-all"
              >
                Пройти диагностику
              </Link>
              <Link
                href={user ? "/dashboard" : "/login"}
                className="px-8 py-4 border-2 border-[#4F7CFF] text-[#4F7CFF] rounded-xl font-semibold hover:bg-[#4F7CFF]/5 hover:-translate-y-0.5 transition-all"
              >
                {user ? "Dashboard" : "Войти"}
              </Link>
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <div className="flex -space-x-2">
                {["А", "М", "К", "Е"].map((l, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] flex items-center justify-center text-white font-bold text-sm border-2 border-white"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span>Тест → план → ежедневная практика</span>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Grammar · пример</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] bg-clip-text text-transparent">72%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Vocabulary · пример</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] bg-clip-text text-transparent">4 / 5</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#4F7CFF]/5 rounded-xl">
                <span className="text-gray-500">A2</span>
                <span className="text-2xl text-[#4F7CFF]">→</span>
                <span className="text-xl font-bold text-[#4F7CFF]">B1</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <span className="text-amber-500 text-lg">Пример</span>
              <span className="text-sm text-gray-600">Результат зависит от вашей практики</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-6 bg-white/60 border-y border-gray-100 overflow-hidden">
        <div className="flex animate-marquee w-max">
          {[...Array(2)].map((_, copy) =>
            ["Grammar", "Vocabulary", "Daily Practice", "Study Plan", "English Feedback", "Progress", "Sentence Correction"].map((t, i) => (
              <span key={`${copy}-${i}`} className="px-10 text-gray-400 font-semibold whitespace-nowrap">{t}</span>
            ))
          )}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Возможности</h2>
          <p className="text-gray-600 text-center mb-12">Полный набор инструментов для диагностики и улучшения английского</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Placement Test", desc: "13 вопросов: грамматика, лексика и исправление предложений" },
              { title: "Grammar Weakness Detection", desc: "Articles, Tenses, Conditionals, Passive Voice" },
              { title: "Vocabulary Gap Analysis", desc: "Слова, переводы и примеры употребления" },
              { title: "Error Analysis Engine", desc: "Grammar error, Wrong tense, Word order, Spelling" },
              { title: "Daily Training", desc: "Письменная практика и общие подсказки без AI" },
              { title: "28-day Study Plan", desc: "Ежедневные задания с отметками о выполнении" },
            ].map((f) => (
              <Link
                key={f.title}
                href={user ? "/test" : "/register"}
                className="block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 hover:border-[#4F7CFF]/30 transition-all"
              >
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold">13</p>
            <p className="opacity-90">вопросов в тесте</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold">28</p>
            <p className="opacity-90">дней в новом плане</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold">3</p>
            <p className="opacity-90">раздела диагностики</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold">AI</p>
            <p className="opacity-90">подсказки по желанию</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
          <p className="text-gray-600 mb-12">Три простых шага до персонального плана обучения</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: 1, title: "Пройди диагностический тест", desc: "Ответь на 13 вопросов и получи ориентир для обучения" },
              { n: 2, title: "Получи анализ слабых тем", desc: "Детальный отчёт с рекомендациями" },
              { n: 3, title: "Учись по персональному плану", desc: "Адаптивные упражнения под твой прогресс" },
            ].map((s) => (
              <div key={s.n} className="relative">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] flex items-center justify-center text-white font-bold text-xl">
                  {s.n}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href={user ? "/test" : "/register"}
            className="inline-block mt-12 px-8 py-4 bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Начать диагностику
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Частые вопросы</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left font-semibold flex justify-between items-center hover:bg-gray-50 transition"
                >
                  {faq.q}
                  <span className={`text-2xl text-[#4F7CFF] transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#4F7CFF] to-[#6AE3FF] rounded-2xl p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Начни практиковать английский уже сегодня
          </h2>
          <Link
            href={user ? "/test" : "/register"}
            className="inline-block px-10 py-4 bg-white text-[#4F7CFF] rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Пройти диагностику бесплатно
          </Link>
        </div>
      </section>
    </div>
  );
}
