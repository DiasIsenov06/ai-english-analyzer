"use client";

type Point = { day: string; value: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function WeeklyActivityChart({
  data,
  unit = "ч",
}: {
  data: Point[];
  unit?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const height = 120;
  const width = 520;
  const padding = 16;

  const stepX = (width - padding * 2) / Math.max(1, data.length - 1);
  const points = data
    .map((d, i) => {
      const x = padding + i * stepX;
      const y =
        padding +
        (1 - clamp(d.value / max, 0, 1)) * (height - padding * 2);
      return { x, y, ...d };
    })
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Weekly Activity
          </p>
          <p className="text-sm text-gray-500">
            Последние 7 дней — время обучения
          </p>
        </div>
        <div className="text-sm text-gray-500">
          max:{" "}
          <span className="font-semibold text-gray-800">
            {max}
            {unit}
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[520px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            role="img"
            aria-label="График активности за неделю"
          >
            <defs>
              <linearGradient id="accentLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#4F7CFF" />
                <stop offset="100%" stopColor="#6AE3FF" />
              </linearGradient>
              <linearGradient id="accentFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#6AE3FF" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* grid */}
            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={padding}
                x2={width - padding}
                y1={padding + t * (height - padding * 2)}
                y2={padding + t * (height - padding * 2)}
                stroke="#EEF2FF"
                strokeWidth="1"
              />
            ))}

            {/* area */}
            <path
              d={`M ${padding},${height - padding} L ${points} L ${
                width - padding
              },${height - padding} Z`}
              fill="url(#accentFill)"
            />

            {/* line */}
            <polyline
              points={points}
              fill="none"
              stroke="url(#accentLine)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* points */}
            {data.map((d, i) => {
              const x = padding + i * stepX;
              const y =
                padding +
                (1 - clamp(d.value / max, 0, 1)) * (height - padding * 2);
              return (
                <g key={d.day}>
                  <circle cx={x} cy={y} r={5} fill="#ffffff" />
                  <circle cx={x} cy={y} r={4} fill="#4F7CFF" />
                </g>
              );
            })}
          </svg>

          <div className="mt-3 grid grid-cols-7 gap-2 text-xs text-gray-500">
            {data.map((d) => (
              <div key={d.day} className="text-center">
                <div className="font-medium text-gray-700">{d.day}</div>
                <div>
                  {d.value}
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        TODO: заменить на реальные данные активности (Recharts можно подключить
        позже, если разрешишь обновить зависимости).
      </p>
    </div>
  );
}

