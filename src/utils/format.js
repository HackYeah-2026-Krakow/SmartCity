export const fmtNumber = (n) => Number(n).toLocaleString('en-US');

export const fmtCompact = (n) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, '')}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
};

export const fmtGoalValue = (v, meta) =>
  `${meta.thousands ? fmtNumber(v) : v.toFixed(meta.decimals)}${meta.unit}`;

export const fmtDelta = (d) => `${d.value}${d.unit === 'pp' ? ' pp' : '%'}`;

// progress = how far baseline -> current has travelled toward target
export const goalProgress = ({ baseline, current, target }) =>
  Math.max(0, Math.min(100, Math.round(((baseline - current) / (baseline - target)) * 100)));

export const reductionPct = ({ baseline, current }) =>
  Math.round(((baseline - current) / baseline) * 1000) / 10;

export function deriveSummary(d) {
  const { congestion, co2, wait } = d.goals;
  return {
    congestionReduction: Math.round(reductionPct(congestion)),
    co2Reduction: reductionPct(co2),
    timeSaved: Math.round((wait.baseline - wait.current) * 10) / 10,
    esgCompletion: goalProgress(co2), // ESG target = emissions goal
  };
}