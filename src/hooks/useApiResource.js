import { useCallback, useEffect, useState } from "react";
import { USE_MOCK } from "../config.js";
import { api } from "../services/api.js";

export function useApiResource(path, mockData, validate, pollIntervalMs = 0) {
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${path}:${attempt}`;
  const [state, setState] = useState({
    path,
    requestKey,
    data: USE_MOCK ? mockData : null,
    loading: !USE_MOCK,
    error: null,
    updatedAt: null,
  });
  const reload = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    if (USE_MOCK) return;
    const controller = new AbortController();
    let inFlight = false;

    async function load() {
      if (inFlight || controller.signal.aborted) return;
      inFlight = true;
      try {
        const data = await api.getJson(path, { signal: controller.signal });
        validate?.(data);
        if (!controller.signal.aborted) {
          setState({ path, requestKey, data, loading: false, error: null, updatedAt: new Date() });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState(previous => ({
            path, requestKey,
            data: pollIntervalMs > 0 && previous.path === path ? previous.data : null,
            loading: false, error,
            updatedAt: pollIntervalMs > 0 && previous.path === path ? previous.updatedAt : null,
          }));
        }
      } finally {
        inFlight = false;
      }
    }
    load();
    const timer = pollIntervalMs > 0 ? setInterval(load, pollIntervalMs) : null;
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [path, validate, requestKey, pollIntervalMs]);

  const current = USE_MOCK
    ? { data: mockData, loading: false, error: null, updatedAt: null }
    : state.requestKey === requestKey
      ? state
      : pollIntervalMs > 0 && state.path === path && state.data
        ? { ...state, error: null }
      : { data: null, loading: true, error: null, updatedAt: null };
  return { ...current, isMock: USE_MOCK, reload };
}
