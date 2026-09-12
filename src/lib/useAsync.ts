import { useEffect, useState } from "react";

export interface Async<T> {
  data: T | null;
  loading: boolean;
  failed: boolean;
}

export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): Async<T> {
  const [state, setState] = useState<Async<T>>({
    data: null,
    loading: true,
    failed: false,
  });

  useEffect(() => {
    let stale = false;
    setState({ data: null, loading: true, failed: false });

    load()
      .then((data) => {
        if (!stale) setState({ data, loading: false, failed: false });
      })
      .catch((err) => {
        console.error("Load failed:", err);
        if (!stale) setState({ data: null, loading: false, failed: true });
      });

    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
