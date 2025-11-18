type CacheValue = unknown;

interface CacheEntry {
  value: CacheValue;
  expiresAt: number;
}

export interface Cache {
  get<T>(key: string): T | null;
  set(key: string, value: CacheValue, ttlMs: number): void;
  delete(key: string): void;
  clear(): void;
}

export class InMemoryCache implements Cache {
  private store = new Map<string, CacheEntry>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set(key: string, value: CacheValue, ttlMs: number): void {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const globalCache = new InMemoryCache();
