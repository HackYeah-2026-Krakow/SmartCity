// Mock mode stays the default. The api Vite mode explicitly opts into requests.
export const USE_MOCK = (import.meta.env?.VITE_USE_MOCK ?? "true") !== "false";

const configuredTimeout = Number(import.meta.env?.VITE_API_TIMEOUT_MS ?? 10000);
export const API_TIMEOUT_MS = Number.isFinite(configuredTimeout) && configuredTimeout > 0
  ? configuredTimeout
  : 10000;
