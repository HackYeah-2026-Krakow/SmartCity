import { useCallback, useEffect, useState } from "react";
import { USE_MOCK } from "../config.js";
import { api } from "../services/api.js";

export function useApiResource(path, mockData, validate) {
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${path}:${attempt}`;
  const [state, setState] = useState({
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

    async function load() {
      try {
        const data = await api.getJson(path, { signal: controller.signal });
        validate?.(data);
        if (!controller.signal.aborted) {
          setState({ requestKey, data, loading: false, error: null, updatedAt: new Date() });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({ requestKey, data: null, loading: false, error, updatedAt: null });
        }
      }
    }
    load();
    return () => controller.abort();
  }, [path, validate, requestKey]);

  const current = USE_MOCK
    ? { data: mockData, loading: false, error: null, updatedAt: null }
    : state.requestKey === requestKey
      ? state
      : { data: null, loading: true, error: null, updatedAt: null };
  return { ...current, isMock: USE_MOCK, reload };
}
