import { API_TIMEOUT_MS, USE_MOCK } from "../config.js";

export class ApiError extends Error {
  constructor(code, message, status = null) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function createApiClient({ useMock = USE_MOCK, timeoutMs = API_TIMEOUT_MS } = {}) {
  async function request(path, { signal, responseType = "json" } = {}) {
      if (useMock) {
        throw new ApiError("MOCK_MODE", "API requests are disabled in mock mode.");
      }
      if (!/^\/api\//.test(path)) {
        throw new ApiError("INVALID_PATH", "API paths must start with /api/.");
      }
      if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError");

      const controller = new AbortController();
      let timedOut = false;
      const cancel = () => controller.abort();
      signal?.addEventListener("abort", cancel, { once: true });
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs);

      try {
        const response = await fetch(path, {
          signal: controller.signal,
          headers: { Accept: responseType === "blob" ? "text/csv" : "application/json" },
        });
        if (!response.ok) {
          throw new ApiError("HTTP_ERROR", `The backend returned HTTP ${response.status}. Please try again.`, response.status);
        }
        if (responseType === "blob" && !response.headers.get("content-type")?.toLowerCase().startsWith("text/csv")) {
          throw new ApiError("INVALID_RESPONSE", "The backend did not return a CSV report. Please try again.");
        }
        try {
          return responseType === "blob" ? await response.blob() : await response.json();
        } catch (error) {
          if (controller.signal.aborted) throw error;
          throw new ApiError("INVALID_RESPONSE", "The backend returned an invalid response. Please try again.");
        }
      } catch (error) {
        if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError");
        if (timedOut) {
          throw new ApiError("TIMEOUT", `The backend did not respond within ${timeoutMs / 1000} second${timeoutMs === 1000 ? "" : "s"}. Please try again.`);
        }
        if (error instanceof ApiError) throw error;
        throw new ApiError("NETWORK_ERROR", "Could not reach the backend. Check that it is running and try again.");
      } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", cancel);
      }
  }
  return {
    getJson: (path, options = {}) => request(path, { ...options, responseType: "json" }),
    getBlob: (path, options = {}) => request(path, { ...options, responseType: "blob" }),
  };
}

export const api = createApiClient();
