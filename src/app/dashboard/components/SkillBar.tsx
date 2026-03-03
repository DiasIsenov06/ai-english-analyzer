"use client";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function SkillBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const v = clamp(Math.round(value), 0, 100);

  const tone =
    v < 45 ? "weak" : v >= 75 ? "strong" : ("mid" as const);

  const barColor =
    tone === "weak"
      ? "from-rose-400 to-rose-500"
      : tone === "strong"
      ? "from-emerald-400 to-emerald-500"
      : "from-accent-start to-accent-end";

  const badge =
    tone === "weak"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : tone === "strong"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-accent-start/10 text-accent-start border-accent-start/20";

  return (
    <div className="flex items-center gap-4">
      <div className="w-28 shrink-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
      </div>

      <div className="flex-1">
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div
            className={`h-full bg-gradient-to-r ${barColor} transition-all duration-500`}
            style={{ width: `${v}%` }}
          />
        </div>
      </div>

      <div className="w-16 shrink-0 text-right">
        <span
          className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-lg border ${badge}`}
          title={tone === "weak" ? "Слабый навык" : tone === "strong" ? "Сильный навык" : "Средний уровень"}
        >
          {v}%
        </span>
      </div>
    </div>
  );
}

