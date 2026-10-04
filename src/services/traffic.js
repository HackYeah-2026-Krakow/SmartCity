import { ApiError } from "./api.js";

const numericFields = ["speedKmh", "congestionPercent", "signalDelaySec", "efficiencyPercent"];
const heatFields = ["trafficSpeed", "congestion", "airPollution", "signalDelays", "greenEfficiency"];
const pointIsValid = point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite);

export function validateTraffic(data) {
  const itemIsValid = item => item && typeof item.id === "string" && typeof item.name === "string"
    && numericFields.every(field => Number.isFinite(item.metrics?.[field]))
    && (item.metrics.no2 == null || Number.isFinite(item.metrics.no2))
    && heatFields.every(field => Number.isFinite(item.heat?.[field]));

  if (!data || !Array.isArray(data.corridors) || !Array.isArray(data.intersections)
    || !data.corridors.every(item => itemIsValid(item) && Array.isArray(item.path) && item.path.length >= 2 && item.path.every(pointIsValid))
    || !data.intersections.every(item => itemIsValid(item) && pointIsValid(item.position))) {
    throw new ApiError("INVALID_RESPONSE", "The backend returned invalid traffic data. Please try again.");
  }
}
