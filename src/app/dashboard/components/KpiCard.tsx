"use client";

import type { ReactNode } from "react";

export default function KpiCard({
  icon,
  label,
  value,
  subtext,
  tone = "neutral",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  subtext?: string;
  tone?: "neutral" | "accent" | "good" | "bad";
}) {
  const toneStyles: Record<typeof tone, string> = {
    neutral: "bg-white border-gray-100",
    accent:
      "bg-gradient-to-br from-white to-accent-start/5 border-accent-start/10",
    good: "bg-gradient-to-br from-white to-emerald-500/5 border-emerald-500/10",
    bad: "bg-gradient-to-br from-white to-rose-500/5 border-rose-500/10",
  };

  return (
    <div
      className={[
        "rounded-2xl border shadow-sm p-5",
        "hover:shadow-md hover:-translate-y-0.5 transition-all",
        toneStyles[tone],
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {value}
            </p>
          </div>
          {subtext ? (
            <p className="mt-1 text-sm text-gray-500">{subtext}</p>
          ) : null}
        </div>

        <div className="shrink-0 rounded-xl p-3 bg-gray-50 border border-gray-100">
          <div className="text-gray-700">{icon}</div>
        </div>
      </div>
    </div>
  );
}

