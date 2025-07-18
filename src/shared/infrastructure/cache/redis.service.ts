import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import RedisClass, { type Redis } from 'ioredis';
import { ICacheService } from '@/shared/domain/cache/cache.service';

@Injectable()
export class RedisService implements ICacheService {
  private readonly client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.client = new RedisClass(this.getConnection());

    this.client.on('connect', () => {
      this.logger.log('Redis client connected', RedisService.name);
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis client error:', error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      const result = value ? JSON.parse(String(value)) : null;
      return result as T;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setex(key, ttlSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting pattern ${pattern}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  }

  async flushAll(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (error) {
      this.logger.error('Error flushing all keys:', error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  private getConnection(): string {
    const isSecure: boolean = this.configService.get<string>('REDIS_IS_SECURE') == 'true';
    const hostname: string = this.configService.get<string>('REDIS_HOSTNAME', 'localhost');
    const password: string = this.configService.get<string>('REDIS_PASSWORD')!;
    const port: number = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const db: number = Number(this.configService.get<number>('REDIS_DB', 0));
    return `redis${isSecure === true ? 's' : ''}://${password ? `:${password}@` : ''}${hostname}:${port}/${db}`;
  }
}
