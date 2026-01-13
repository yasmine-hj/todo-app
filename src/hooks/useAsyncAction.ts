import { useState, useCallback, useRef } from "react";

interface AsyncActionResult {
  isLoading: boolean;
  execute: <T>(action: () => Promise<T>) => Promise<T | undefined>;
}

/**
 * Async action loading state management:
 *
 * @returns Loading state and execute function
 */
export function useAsyncAction(): AsyncActionResult {
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const execute = useCallback(
    async <T>(action: () => Promise<T>): Promise<T | undefined> => {
      if (isLoadingRef.current) return undefined;

      try {
        isLoadingRef.current = true;
        setIsLoading(true);
        return await action();
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, execute };
}
