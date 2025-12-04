import { useState, useEffect } from 'react';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

interface UseLoadingStateOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoFetch?: boolean;
}

export function useLoadingState<T>({
  fetchFn,
  onSuccess,
  onError,
  autoFetch = true,
}: UseLoadingStateOptions<T>) {
  const [state, setState] = useState<LoadingState>(autoFetch ? 'loading' : 'idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setState('loading');
    setError(null);
    
    try {
      const result = await fetchFn();
      
      // Check if result is empty (array, object, etc.)
      if (Array.isArray(result) && result.length === 0) {
        setState('empty');
      } else if (typeof result === 'object' && result !== null && Object.keys(result).length === 0) {
        setState('empty');
      } else {
        setState('success');
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setState('error');
      setError(error);
      onError?.(error);
    }
  };

  const refetch = () => {
    fetch();
  };

  const reset = () => {
    setState('idle');
    setData(null);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, []);

  return {
    state,
    data,
    error,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    isEmpty: state === 'empty',
    refetch,
    reset,
  };
}
