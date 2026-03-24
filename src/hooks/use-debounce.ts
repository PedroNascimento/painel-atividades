"use client";

import { useRef, useCallback } from "react";

export function useDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: unknown[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  ) as T;

  return debouncedFn;
}
