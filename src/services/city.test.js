import assert from "node:assert/strict";
import { test } from "node:test";
import { rankedIntersections, validateImpact, validateIntersections, validateSummary } from "./city.js";

test("summary accepts zero and unknown measurements", () => {
  validateSummary({ simulated: false, cards: [
    { id: "avg-delay", label: "Delay", value: "0", raw: 0, changePct: null },
    { id: "avg-speed", label: "Speed", value: "n/a", raw: null, changePct: null },
  ] });
});

test("invalid summary metrics are rejected before rendering", () => {
  assert.throws(() => validateSummary({ simulated: true, cards: [
    { id: "avg-delay", label: "Delay", value: "NaN", raw: NaN },
  ] }), { code: "INVALID_RESPONSE" });
  assert.throws(() => validateSummary({}), { code: "INVALID_RESPONSE" });
});

test("insufficient impact data is valid and does not invent comparisons", () => {
  validateImpact({ insufficientData: true, cards: [], targetReductionPct: 60, basis: "Not enough trips" });
});

test("impact supports increases as well as reductions", () => {
  validateImpact({ insufficientData: false, targetReductionPct: 60, basis: "Model", cards: [
    { id: "fuel", title: "Fuel", unit: "litres", baseline: 1, current: 2, target: 0.4, progress: 0, changePct: 100, badge: "100% increase" },
  ] });
  assert.throws(() => validateImpact({ insufficientData: false, targetReductionPct: 60, basis: "Model", cards: [{}] }), { code: "INVALID_RESPONSE" });
});

test("intersections with fewer than the privacy threshold are rejected", () => {
  validateIntersections({ k: 5, hiddenCount: 17, items: [] });
  assert.throws(() => validateIntersections({ k: 5, hiddenCount: 0, items: [
    { id: 1, name: "Intersection", sampleSize: 4, meanDelaySec: 0, p95DelaySec: 0, vehicleHoursLostPerHour: 0, fuelLitresPerHour: 0, co2KgPerHour: 0, confidence: "low" },
  ] }), { code: "INVALID_RESPONSE" });
});

test("ranking uses time loss rather than delay and does not mutate API data", () => {
  const items = [
    { id: 1, meanDelaySec: 100, vehicleHoursLostPerHour: 1 },
    { id: 2, meanDelaySec: 20, vehicleHoursLostPerHour: 10 },
    { id: 3, meanDelaySec: 40, vehicleHoursLostPerHour: 5 },
  ];
  assert.deepEqual(rankedIntersections(items, 2).map(item => item.id), [2, 3]);
  assert.deepEqual(items.map(item => item.id), [1, 2, 3]);
});
