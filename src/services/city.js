import { ApiError } from "./api.js";

const fail = () => { throw new ApiError("INVALID_RESPONSE", "The backend returned invalid dashboard data. Please try again."); };
const finiteOrNull = value => value == null || Number.isFinite(value);
const hasId = value => value && typeof value.id === "string";

export function validateSummary(data) {
  if (!data || !Array.isArray(data.cards) || typeof data.simulated !== "boolean"
    || !data.cards.every(card => hasId(card) && typeof card.label === "string" && typeof card.value === "string"
      && finiteOrNull(card.raw) && finiteOrNull(card.changePct))) fail();
}

export function validateImpact(data) {
  if (!data || !Array.isArray(data.cards) || typeof data.insufficientData !== "boolean"
    || !Number.isFinite(data.targetReductionPct) || typeof data.basis !== "string"
    || !data.cards.every(card => hasId(card) && typeof card.title === "string" && typeof card.unit === "string"
      && [card.baseline, card.current, card.target, card.progress, card.changePct].every(Number.isFinite)
      && typeof card.badge === "string")) fail();
}

export function validateIntersections(data) {
  if (!data || !Array.isArray(data.items) || !Number.isInteger(data.k) || data.k < 1
    || !Number.isInteger(data.hiddenCount) || data.hiddenCount < 0
    || !data.items.every(item => Number.isInteger(item.id) && typeof item.name === "string"
      && Number.isInteger(item.sampleSize) && item.sampleSize >= data.k
      && [item.meanDelaySec, item.p95DelaySec, item.vehicleHoursLostPerHour, item.fuelLitresPerHour, item.co2KgPerHour].every(Number.isFinite)
      && typeof item.confidence === "string")) fail();
}

export const summaryLabels = {
  "avg-speed": "Network average speed",
  "avg-delay": "Average signal delay",
  "traffic-volume": "Estimated traffic flow",
  drivers: "Drivers with points",
  "time-lost": "Estimated time lost",
  "fuel-lost": "Estimated fuel lost at stops",
  co2: "Estimated CO₂ from stops",
};

export const impactTitles = {
  fuel: "Fuel lost at stops",
  cost: "Cost of fuel lost",
  co2: "CO₂ from stops",
};

export function rankedIntersections(items, limit = 5) {
  return [...items].sort((a, b) => b.vehicleHoursLostPerHour - a.vehicleHoursLostPerHour).slice(0, limit);
}
