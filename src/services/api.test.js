import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { createApiClient } from "./api.js";
import { validateTraffic } from "./traffic.js";

afterEach(() => mock.restoreAll());
const realClient = options => createApiClient({ useMock: false, ...options });
const waitForAbort = signal => new Promise((_, reject) => {
  signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
});

test("mock mode never makes an API request", async () => {
  const fetchMock = mock.method(globalThis, "fetch", () => assert.fail("Unexpected request"));
  await assert.rejects(createApiClient({ useMock: true }).getJson("/api/city/traffic"), { code: "MOCK_MODE" });
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("requests preserve /api/ paths and decode JSON", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => Response.json({ corridors: [], intersections: [] }));
  assert.deepEqual(await realClient().getJson("/api/city/traffic"), { corridors: [], intersections: [] });
  assert.equal(fetchMock.mock.calls[0].arguments[0], "/api/city/traffic");
});

test("HTTP errors remain HTTP errors even when the body is HTML", async () => {
  mock.method(globalThis, "fetch", async () => new Response("Unavailable", { status: 503 }));
  await assert.rejects(realClient().getJson("/api/city/traffic"), { code: "HTTP_ERROR", status: 503 });
});

test("a disconnected backend produces a network error", async () => {
  mock.method(globalThis, "fetch", async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(realClient().getJson("/api/city/traffic"), { code: "NETWORK_ERROR" });
});

test("a stalled request is aborted at the timeout", async () => {
  mock.method(globalThis, "fetch", (_, { signal }) => waitForAbort(signal));
  await assert.rejects(realClient({ timeoutMs: 20 }).getJson("/api/city/traffic"), { code: "TIMEOUT" });
});

test("timeout also covers a stalled response body", async () => {
  mock.method(globalThis, "fetch", async (_, { signal }) => ({ ok: true, json: () => waitForAbort(signal) }));
  await assert.rejects(realClient({ timeoutMs: 20 }).getJson("/api/city/traffic"), { code: "TIMEOUT" });
});

test("successful non-JSON responses produce a readable error", async () => {
  mock.method(globalThis, "fetch", async () => new Response("<html>Not JSON</html>"));
  await assert.rejects(realClient().getJson("/api/city/traffic"), { code: "INVALID_RESPONSE" });
});

test("screen cancellation does not become a network or timeout error", async () => {
  mock.method(globalThis, "fetch", (_, { signal }) => waitForAbort(signal));
  const controller = new AbortController();
  const pending = realClient().getJson("/api/city/traffic", { signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, { name: "AbortError" });
});

test("requests outside /api/ are rejected before fetch", async () => {
  const fetchMock = mock.method(globalThis, "fetch", () => assert.fail("Unexpected request"));
  await assert.rejects(realClient().getJson("https://example.com"), { code: "INVALID_PATH" });
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("empty traffic is valid; malformed traffic is rejected", () => {
  validateTraffic({ corridors: [], intersections: [] });
  assert.throws(() => validateTraffic({}), { code: "INVALID_RESPONSE" });
  assert.throws(() => validateTraffic({ corridors: [{}], intersections: [] }), { code: "INVALID_RESPONSE" });
});

test("backend traffic with no NO2 measurements is valid", () => {
  const metrics = { speedKmh: 25, congestionPercent: 50, signalDelaySec: 30, efficiencyPercent: 25, no2: null };
  const heat = { trafficSpeed: 0.5, congestion: 0.5, airPollution: 0.4, signalDelays: 0.3, greenEfficiency: 0.25 };
  validateTraffic({
    corridors: [{ id: "corridor", name: "Corridor", path: [[50, 19], [50.1, 19.1]], metrics, heat }],
    intersections: [{ id: "intersection", name: "Intersection", position: [50, 19], metrics, heat }],
  });
});

test("CSV export decodes the response as a file", async () => {
  mock.method(globalThis, "fetch", async () => new Response("name,delay\nDemo,20\n", { headers: { "Content-Type": "text/csv" } }));
  const file = await realClient().getBlob("/api/city/reports/intersections.csv");
  assert.equal(await file.text(), "name,delay\nDemo,20\n");
});

test("CSV export uses the same HTTP and mock-mode protection", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => new Response("Unavailable", { status: 503 }));
  await assert.rejects(realClient().getBlob("/api/city/reports/intersections.csv"), { code: "HTTP_ERROR", status: 503 });
  await assert.rejects(createApiClient({ useMock: true }).getBlob("/api/city/reports/intersections.csv"), { code: "MOCK_MODE" });
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("CSV export refuses an HTML fallback page", async () => {
  mock.method(globalThis, "fetch", async () => new Response("<html>Fallback</html>", { headers: { "Content-Type": "text/html" } }));
  await assert.rejects(realClient().getBlob("/api/city/reports/intersections.csv"), { code: "INVALID_RESPONSE" });
});
