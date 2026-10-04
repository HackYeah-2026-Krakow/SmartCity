import { GOAL_META } from '../data/cityData';
import { fmtGoalValue, goalProgress, reductionPct } from '../utils/format';

export default function GoalCard({ id, goal }) {
  const meta = GOAL_META[id];
  const progress = goalProgress(goal);
  const pct = Math.round(reductionPct(goal));

  return (
    <div className="rounded-2xl bg-gray-50 p-5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-lg font-medium">{meta.title}</h4>
        <span className="whitespace-nowrap rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          {pct}% {meta.noun}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{meta.subtitle}</p>

      <div className="mt-5 grid grid-cols-3 text-center">
        {[['Baseline', goal.baseline], ['Current', goal.current], ['Target', goal.target]].map(([l, v]) => (
          <div key={l}>
            <p className="text-xs uppercase tracking-wider text-gray-500">{l}</p>
            <p className="mt-2 text-xl font-bold">{fmtGoalValue(v, meta)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-green-400 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-center text-sm text-gray-500">{progress}% of the way to target</p>
    </div>
  );
}