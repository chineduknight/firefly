import axios, { AxiosError } from "axios";

export interface RetryOptions {
  retries: number;
  initialDelayMs: number;
  maxDelayMs?: number;
}

export interface CircuitBreakerOptions {
  failureThreshold: number;
  openDurationMs: number;
}

class CircuitBreaker {
  private failureCount = 0;
  private openedUntil: number | null = null;

  constructor(private readonly options: CircuitBreakerOptions) {}

  public canExecute(): boolean {
    if (this.openedUntil === null) return true;
    if (Date.now() > this.openedUntil) {
      // Move to half-open: allow a request again
      this.failureCount = 0;
      this.openedUntil = null;
      return true;
    }
    return false;
  }

  public recordSuccess(): void {
    this.failureCount = 0;
    this.openedUntil = null;
  }

  public recordFailure(): void {
    this.failureCount += 1;
    if (this.failureCount >= this.options.failureThreshold) {
      this.openedUntil = Date.now() + this.options.openDurationMs;
    }
  }

  public isOpen(): boolean {
    return !this.canExecute();
  }
}

const defaultRetryOptions: RetryOptions = {
  retries: 2,
  initialDelayMs: 200,
  maxDelayMs: 1000,
};

const defaultBreakerOptions: CircuitBreakerOptions = {
  failureThreshold: 5,
  openDurationMs: 30_000,
};

const pokeApiBreaker = new CircuitBreaker(defaultBreakerOptions);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function withPokeApiResilience<T>(
  fn: () => Promise<T>,
  retryOptions: Partial<RetryOptions> = {}
): Promise<T> {
  const { retries, initialDelayMs, maxDelayMs } = {
    ...defaultRetryOptions,
    ...retryOptions,
  };

  if (!pokeApiBreaker.canExecute()) {
    // Fail fast when breaker is open
    throw new Error("PokeAPI temporarily unavailable (circuit open).");
  }

  let attempt = 0;
  let delay = initialDelayMs;

  for (;;) {
    try {
      const result = await fn();
      pokeApiBreaker.recordSuccess();
      return result;
    } catch (err) {
      const isAxiosErr = axios.isAxiosError(err);
      const status = (err as AxiosError)?.response?.status;

      const isRetryable =
        isAxiosErr && (!status || (status >= 500 && status < 600));

      if (!isRetryable || attempt >= retries) {
        pokeApiBreaker.recordFailure();
        throw err;
      }

      attempt += 1;
      await sleep(delay);
      delay = Math.min(delay * 2, maxDelayMs ?? delay);
    }
  }
}
