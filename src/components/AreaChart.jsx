import { useId, useRef, useState } from 'react';
import { fmtCompact, fmtNumber } from '../utils/format';

const W = 900, H = 300;
const PAD = { l: 48, r: 16, t: 16, b: 30 };

function niceStep(max) {
  const raw = max / 4;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const r = raw / p;
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p;
}

export default function AreaChart({ points, height = 'auto', interactive = true }) {
  const gid = useId();
  const ref = useRef(null);
  const [hover, setHover] = useState(null);

  if (!points?.length) return null;

  const step = niceStep(Math.max(...points.map((p) => p.value)));
  const top = Math.ceil(Math.max(...points.map((p) => p.value)) / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);

  const iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
  const x = (i) => PAD.l + (points.length === 1 ? iw : (i / (points.length - 1)) * iw);
  const y = (v) => PAD.t + ih - (v / top) * ih;

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
  const area = `${line} L${x(points.length - 1)},${PAD.t + ih} L${x(0)},${PAD.t + ih} Z`;

  const labelEvery = Math.ceil(points.length / 9);
  const active = hover ?? points.length - 1;

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / iw) * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, i)));
  };

  const tipW = 130, tipX = Math.min(Math.max(x(active) - tipW / 2, PAD.l), W - PAD.r - tipW);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height }}
      onMouseMove={interactive ? onMove : undefined}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#e5e7eb" />
          <text x={PAD.l - 10} y={y(t) + 4} textAnchor="end" fontSize="13" fill="#6b7280">
            {t === 0 ? '0' : fmtCompact(t)}
          </text>
        </g>
      ))}

      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) =>
        i % labelEvery === 0 || i === points.length - 1 ? (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="13" fill="#6b7280">
            {p.label}
          </text>
        ) : null
      )}

      {interactive && (
        <g>
          <line x1={x(active)} x2={x(active)} y1={PAD.t} y2={PAD.t + ih} stroke="#16a34a" strokeOpacity="0.25" />
          <circle cx={x(active)} cy={y(points[active].value)} r="5" fill="#16a34a" stroke="#fff" strokeWidth="2" />
          <g transform={`translate(${tipX}, ${Math.max(y(points[active].value) - 52, 2)})`}>
            <rect width={tipW} height="40" rx="8" fill="#111" />
            <text x={tipW / 2} y="17" textAnchor="middle" fontSize="11" fill="#9ca3af">{points[active].label}</text>
            <text x={tipW / 2} y="33" textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff">
              {fmtNumber(points[active].value)}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}