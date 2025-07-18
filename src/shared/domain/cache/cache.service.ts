export const CACHE_SERVICE: symbol = Symbol('CACHE_SERVICE');

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPattern(pattern: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  flushAll(): Promise<void>;
  onModuleDestroy(): Promise<void>;
}
