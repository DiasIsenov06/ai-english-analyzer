"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent"
        >
          AI English Analyzer
        </Link>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div
          className={`absolute md:static top-full left-0 right-0 md:flex items-center gap-6 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none ${
            open ? "block" : "hidden"
          }`}
        >
          <Link
            href="/"
            className={`block py-2 ${pathname === "/" ? "text-accent-start font-semibold" : "text-gray-600 hover:text-accent-start"}`}
            onClick={() => setOpen(false)}
          >
            Главная
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`block py-2 ${pathname === "/dashboard" ? "text-accent-start font-semibold" : "text-gray-600 hover:text-accent-start"}`}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/test"
                className={`block py-2 ${pathname === "/test" ? "text-accent-start font-semibold" : "text-gray-600 hover:text-accent-start"}`}
                onClick={() => setOpen(false)}
              >
                Тест
              </Link>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="block py-2 text-gray-600 hover:text-red-500"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`block py-2 ${pathname === "/login" ? "text-accent-start font-semibold" : "text-gray-600 hover:text-accent-start"}`}
                onClick={() => setOpen(false)}
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-start/30 hover:-translate-y-0.5 transition-all"
                onClick={() => setOpen(false)}
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
