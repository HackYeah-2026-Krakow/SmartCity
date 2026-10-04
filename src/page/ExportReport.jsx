import { ArrowLeft, Printer, FileSpreadsheet } from 'lucide-react';
import { DATA, RANGES, GOAL_META, GRANULARITIES } from '../data/cityData';
import { fmtNumber, fmtCompact, fmtGoalValue, goalProgress, reductionPct, deriveSummary } from '../utils/format';
import AreaChart from '../components/AreaChart';

function buildCsv(range) {
  const d = DATA[range];
  const rows = [['Section', 'Metric', 'Value']];
  Object.entries(d.kpis).forEach(([k, v]) => rows.push(['KPI', k, v.value], ['KPI', `${k} change (${v.unit})`, v.delta]));
  Object.entries(d.tiles).forEach(([k, v]) => rows.push(['Usage', k, v]));
  d.districts.forEach((x) => rows.push(['District share of trips (%)', x.name, x.share]));
  Object.entries(d.goals).forEach(([k, g]) =>
    rows.push(['Goal', `${k} baseline`, g.baseline], ['Goal', `${k} current`, g.current], ['Goal', `${k} target`, g.target])
  );
  GRANULARITIES.forEach((g) => d.adoption[g.id]?.forEach((p) => rows.push([`Adoption (${g.id})`, p.label, p.value])));
  return rows.map((r) => r.join(',')).join('\n');
}

function downloadCsv(range) {
  const url = URL.createObjectURL(new Blob([buildCsv(range)], { type: 'text/csv' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `greenpace-iq-${range}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportReport({ range, onBack }) {
  const d = DATA[range];
  const meta = RANGES.find((r) => r.id === range);
  const s = deriveSummary(d);
  const k = d.kpis;
  const gran = d.adoption.defaultView;
  const topDistrict = [...d.districts].sort((a, b) => b.share - a.share)[0];

  const insights = [
    `Active users grew ${k.activeUsers.delta}% ${meta.compare}, reaching ${fmtNumber(k.activeUsers.value)}.`,
    `Peak-hour congestion fell from ${d.goals.congestion.baseline}% to ${d.goals.congestion.current}% (target ${d.goals.congestion.target}%).`,
    `Estimated emissions are down ${s.co2Reduction}% – ${s.esgCompletion}% of the way to the CO₂ target.`,
    `${topDistrict.name} generates the largest share of analysed trips (${topDistrict.share}%).`,
    `Drivers save an average of ${s.timeSaved} min per trip in waiting time at traffic lights.`,
  ];

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* toolbar (not printed) */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-8 py-4 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium hover:text-green-700">
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <div className="flex gap-3">
          <button onClick={() => downloadCsv(range)} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            <FileSpreadsheet size={16} /> Download CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2 text-sm font-semibold text-white">
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* A4-like page */}
      <article className="mx-auto my-8 max-w-[900px] space-y-8 bg-white p-12 shadow-sm print:my-0 print:shadow-none">
        <header className="flex items-start justify-between border-b pb-6">
          <div>
            <p className="text-sm font-semibold tracking-widest text-green-700">GREENPACE IQ</p>
            <h1 className="mt-1 text-3xl font-bold">City Impact Report</h1>
            <p className="mt-1 text-gray-500">{meta.long} · Generated {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-green-700">{d.cityScore}</p>
            <p className="text-xs tracking-wider text-gray-500">CITY SCORE</p>
          </div>
        </header>

        <section>
          <h2 className="mb-3 text-lg font-bold">Key findings</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-gray-700">{insights.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Headline numbers</h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              ['Active users', fmtNumber(k.activeUsers.value), k.activeUsers.delta + '%'],
              ['Total users', fmtNumber(k.totalUsers.value), k.totalUsers.delta + '%'],
              ['Trips analysed', fmtCompact(k.trips.value), k.trips.delta + '%'],
              ['Avg. daily usage', `${k.avgUsage.value} min`, k.avgUsage.delta + '%'],
              ['Share of drivers', `${k.driverShare.value}%`, k.driverShare.delta + ' pp'],
            ].map(([l, v, dl]) => (
              <div key={l} className="rounded-xl border p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">{l}</p>
                <p className="mt-1 text-xl font-bold">{v}</p>
                <p className="text-xs font-semibold text-green-700">↑ +{dl}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-bold">Adoption trend</h2>
          <p className="mb-2 text-sm text-gray-500">{GRANULARITIES.find((g) => g.id === gran).metric}</p>
          <AreaChart points={d.adoption[gran]} interactive={false} />
        </section>

        <section className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="mb-3 text-lg font-bold">Usage by district</h2>
            <table className="w-full text-sm">
              <tbody>
                {d.districts.map((x) => (
                  <tr key={x.name} className="border-b">
                    <td className="py-2">{x.name}</td>
                    <td className="py-2 text-right font-semibold">{x.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-bold">Usage snapshot</h2>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Daily active users', fmtNumber(d.tiles.dau)],
                  ['Weekly active users', fmtNumber(d.tiles.wau)],
                  ['Trips per day', fmtNumber(d.tiles.tripsPerDay)],
                  ['Avg. trip', `${d.tiles.avgTripMin} min · ${d.tiles.avgTripKm} km`],
                ].map(([l, v]) => (
                  <tr key={l} className="border-b"><td className="py-2">{l}</td><td className="py-2 text-right font-semibold">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Impact vs. city goals</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2">Goal</th><th>Baseline</th><th>Current</th><th>Target</th><th>Change</th><th className="text-right">Progress</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(d.goals).map(([id, g]) => {
                const m = GOAL_META[id];
                return (
                  <tr key={id} className="border-b">
                    <td className="py-2.5 font-medium">{m.title}</td>
                    <td>{fmtGoalValue(g.baseline, m)}</td>
                    <td>{fmtGoalValue(g.current, m)}</td>
                    <td>{fmtGoalValue(g.target, m)}</td>
                    <td className="text-green-700">−{Math.round(reductionPct(g))}%</td>
                    <td className="text-right font-semibold">{goalProgress(g)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="grid grid-cols-4 gap-3 rounded-xl bg-green-50 p-5 text-center">
          {[
            [`−${s.congestionReduction}%`, 'Congestion'],
            [`−${s.co2Reduction}%`, 'CO₂ emissions'],
            [`${s.timeSaved} min`, 'Saved per trip'],
            [`${s.esgCompletion}%`, 'ESG target'],
          ].map(([v, l]) => (
            <div key={l}><p className="text-2xl font-bold text-green-700">{v}</p><p className="text-xs text-gray-600">{l}</p></div>
          ))}
        </section>

        <footer className="border-t pt-4 text-xs text-gray-400">
          Based on anonymised data from participating drivers. © GreenPace IQ · Mobility Office
        </footer>
      </article>
    </div>
  );
}