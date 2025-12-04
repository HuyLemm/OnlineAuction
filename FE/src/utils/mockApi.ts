/**
 * Mock API utilities for simulating async operations
 * Useful for demonstrating loading, error, and empty states
 */

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockFetch<T>(
  data: T,
  options: {
    delay?: number;
    shouldFail?: boolean;
    errorMessage?: string;
  } = {}
): Promise<T> {
  const { 
    delay: delayMs = 1000, 
    shouldFail = false, 
    errorMessage = 'Failed to fetch data' 
  } = options;

  await delay(delayMs);

  if (shouldFail) {
    throw new Error(errorMessage);
  }

  return data;
}

export function randomDelay(min: number = 500, max: number = 2000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shouldSimulateError(probability: number = 0.1): boolean {
  return Math.random() < probability;
}

export function shouldSimulateEmpty(probability: number = 0.2): boolean {
  return Math.random() < probability;
}
