import { useEffect, useRef, useState } from "react";
import "./CityImpact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import StatCard from "../components/StatCard";
import ImpactMetricCard from "../components/ImpactMetricCard";
import { useApiResource } from "../hooks/useApiResource.js";
import { api } from "../services/api.js";
import {
  impactTitles, rankedIntersections, summaryLabels,
  validateImpact, validateIntersections, validateSummary,
} from "../services/city.js";

const snapshotIds = ["avg-speed", "avg-delay", "traffic-volume", "drivers"];
const lossIds = ["time-lost", "fuel-lost", "co2"];
const panelClass = "rounded-xl border border-[#e1e7e3] bg-white p-4";
const buttonClass = "rounded-lg border border-[#dce4de] bg-white px-3 py-2 text-sm font-semibold hover:bg-[#f3f6f4] disabled:cursor-wait disabled:opacity-50";

function ResourceContent({ resource, empty, children, emptyMessage = "No data is available yet." }) {
  if (resource.loading) return <div role="status" className="py-8 text-center text-sm text-[#66716a]">Loading data…</div>;
  if (resource.error) return (
    <div role="alert" className="py-6 text-center">
      <p className="mb-3 text-sm text-[#b42318]">{resource.error.message}</p>
      <button type="button" onClick={resource.reload} className={buttonClass}>Try again</button>
    </div>
  );
  if (empty) return <p role="status" className="py-6 text-sm text-[#66716a]">{emptyMessage}</p>;
  return children;
}

function SummaryCards({ resource, ids, noStopData = false }) {
  const cards = ids.map(id => resource.data?.cards.find(card => card.id === id)).filter(Boolean);
  return (
    <ResourceContent resource={resource} empty={cards.length === 0}>
      <div className={`grid gap-3 max-[700px]:grid-cols-1 ${ids.length === 4 ? "grid-cols-4 max-[1100px]:grid-cols-2" : "grid-cols-3 max-[1100px]:grid-cols-1"}`}>
        {cards.map(card => (
          <StatCard
            key={card.id}
            label={summaryLabels[card.id] ?? card.label}
            value={card.value === "n/a" || (noStopData && ["avg-delay", "traffic-volume", ...lossIds].includes(card.id)) ? "No data" : card.value}
            suffix={card.value === "n/a" || (noStopData && ["avg-delay", "traffic-volume", ...lossIds].includes(card.id)) ? null : card.suffix}
            change={card.change}
            changePct={card.changePct}
            lowerIsBetter={card.id === "avg-delay"}
          />
        ))}
      </div>
    </ResourceContent>
  );
}

export default function ApiCityImpactPage() {
  const summary = useApiResource("/api/city/summary", null, validateSummary);
  const impact = useApiResource("/api/city/impact", null, validateImpact);
  const intersections = useApiResource("/api/city/intersections", null, validateIntersections);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const exportController = useRef(null);
  useEffect(() => () => exportController.current?.abort(), []);

  const loading = summary.loading || impact.loading || intersections.loading;
  const ranked = rankedIntersections(intersections.data?.items ?? []);
  const noStopData = intersections.data?.items.length === 0;

  function refresh() {
    summary.reload();
    impact.reload();
    intersections.reload();
  }

  async function exportReport() {
    exportController.current?.abort();
    const controller = new AbortController();
    exportController.current = controller;
    setExporting(true);
    setExportError(null);
    try {
      const blob = await api.getBlob("/api/city/reports/intersections.csv", { signal: controller.signal });
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "greenpace-intersections.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      if (!controller.signal.aborted) setExportError(error.message);
    } finally {
      if (!controller.signal.aborted) setExporting(false);
    }
  }

  return (
    <div className="city-impact-api min-h-full bg-[#edf1ef] p-5 text-[#151a17] max-[700px]:p-3">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold">City Impact Dashboard</h1>
          <p className="mt-1 text-sm text-[#66716a]">Intersection delays, estimated losses and modelled driver impact.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold">
            {summary.loading ? "Loading data" : summary.error ? "Source unavailable" : summary.data?.simulated ? "Simulated data · API" : "API data"}
          </span>
          <button type="button" onClick={refresh} disabled={loading} className={buttonClass}>Refresh</button>
          <button type="button" onClick={exportReport} disabled={exporting} className={buttonClass}>
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            {exporting ? "Exporting…" : "Export intersection CSV"}
          </button>
        </div>
      </header>
      {exportError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-[#b42318]">Export failed: {exportError}</p>}
      {summary.data?.simulated && (
        <p className="mb-4 rounded-lg border border-[#cce5d5] bg-[#e7f5ec] p-3 text-sm">
          This dashboard includes simulated trips. Changes below describe the simulation and do not demonstrate a measured improvement in city traffic.
        </p>
      )}

      <section className={`${panelClass} mb-4`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Traffic snapshot</h2>
          {summary.updatedAt && <span className="text-xs text-[#66716a]">Summary fetched at {summary.updatedAt.toLocaleTimeString()}</span>}
        </div>
        <SummaryCards resource={summary} ids={snapshotIds} noStopData={noStopData} />
        <p className="mt-3 text-xs text-[#66716a]">Average speed covers the modelled corridor network. Traffic flow is estimated; drivers with points are participants with an earnings history.</p>
      </section>

      <section className={`${panelClass} mb-4`}>
        <h2 className="mb-3 text-lg font-bold">Estimated losses at intersections</h2>
        <SummaryCards resource={summary} ids={lossIds} noStopData={noStopData} />
        <p className="mt-3 text-xs text-[#66716a]">Vehicle-hours combine waiting time across vehicles. Hourly losses use assumed traffic flow and include only intersections with enough stop samples. CO₂ is a fuel-based estimate.</p>
      </section>

      <section className={`${panelClass} mb-4`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold">Modelled impact: without vs. with advice</h2>
            <p className="mt-1 text-xs text-[#66716a]">Baseline · With advice · Target</p>
          </div>
          {impact.data && <span className="text-xs text-[#66716a]">Assumed target: {impact.data.targetReductionPct}% reduction</span>}
        </div>
        <ResourceContent resource={impact} empty={false}>
          {impact.data?.insufficientData || impact.data?.cards.length === 0 ? (
            <p role="status" className="py-6 text-sm text-[#66716a]">Not enough trips in both groups to compare impact.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
              {impact.data?.cards.map(card => (
                <ImpactMetricCard key={card.id} {...card} title={impactTitles[card.id] ?? card.title} />
              ))}
            </div>
          )}
          {impact.data && <p className="mt-4 text-xs leading-relaxed text-[#66716a]">{impact.data.basis}</p>}
        </ResourceContent>
      </section>

      <section className={`${panelClass} mb-4`}>
        <h2 className="text-lg font-bold">Intersections with the highest estimated time loss</h2>
        <p className="mt-1 text-xs text-[#66716a]">Top five, ranked by vehicle-hours lost per hour.</p>
        <ResourceContent resource={intersections} empty={ranked.length === 0} emptyMessage={intersections.data ? `No intersections have at least ${intersections.data.k} stop samples. Hidden intersections: ${intersections.data.hiddenCount}.` : undefined}>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-[#e1e7e3] text-xs text-[#66716a]">
                <tr>
                  <th scope="col" className="py-3 pr-3">Intersection</th>
                  <th scope="col" className="py-3 pr-3">Avg. wait</th>
                  <th scope="col" className="py-3 pr-3">P95 wait</th>
                  <th scope="col" className="py-3 pr-3">Time loss</th>
                  <th scope="col" className="py-3 pr-3">Stop samples</th>
                  <th scope="col" className="py-3">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map(item => (
                  <tr key={item.id} className="border-b border-[#eef2ef] last:border-0">
                    <th scope="row" className="py-3 pr-3 font-semibold">{item.name}</th>
                    <td className="py-3 pr-3">{item.meanDelaySec} s</td>
                    <td className="py-3 pr-3">{item.p95DelaySec} s</td>
                    <td className="py-3 pr-3">{item.vehicleHoursLostPerHour} veh-h/h</td>
                    <td className="py-3 pr-3">{item.sampleSize}</td>
                    <td className="py-3 capitalize">{item.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {intersections.data && <p className="mt-3 text-xs text-[#66716a]">Minimum sample: {intersections.data.k} stops. Hidden intersections: {intersections.data.hiddenCount}. Confidence labels reflect stop sample count.</p>}
          {ranked[0]?.explanation && (
            <details className="mt-3 rounded-lg bg-[#f3f6f4] p-3 text-sm">
              <summary className="cursor-pointer font-semibold">Why {ranked[0].name} ranks first</summary>
              <p className="mt-2 text-[#66716a]">{ranked[0].explanation}</p>
            </details>
          )}
        </ResourceContent>
      </section>
    </div>
  );
}
