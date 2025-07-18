/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '@/shared/infrastructure/cache/redis.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

// Mock ioredis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    exists: jest.fn(),
    flushall: jest.fn(),
    quit: jest.fn(),
  }));
});

describe('RedisService', () => {
  let service: RedisService;
  let logger: Logger;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(async () => {
    // Clear all instances and calls to constructor and all methods:
    (Redis as unknown as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              if (key === 'REDIS_IS_SECURE') return 'false';
              if (key === 'REDIS_HOSTNAME') return 'localhost';
              if (key === 'REDIS_PASSWORD') return '';
              if (key === 'REDIS_PORT') return 6379;
              if (key === 'REDIS_DB') return 0;
              return defaultValue;
            }),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    logger = module.get<Logger>(Logger);
    mockRedis = (Redis as unknown as jest.Mock).mock.results[0].value;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to Redis on instantiation', () => {
    expect(Redis).toHaveBeenCalledTimes(1);
    expect(Redis).toHaveBeenCalledWith('redis://localhost:6379/0');
    expect(mockRedis.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockRedis.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  describe('get', () => {
    it('should return parsed JSON value if key exists', async () => {
      const testKey = 'test-key';
      const testValue = { data: 'some-data' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(testValue));

      const result = await service.get(testKey);
      expect(mockRedis.get).toHaveBeenCalledWith(testKey);
      expect(result).toEqual(testValue);
    });

    it('should return null if key does not exist', async () => {
      const testKey = 'non-existent-key';
      mockRedis.get.mockResolvedValueOnce(null);

      const result = await service.get(testKey);
      expect(mockRedis.get).toHaveBeenCalledWith(testKey);
      expect(result).toBeNull();
    });

    it('should log error and return null if get fails', async () => {
      const testKey = 'error-key';
      const error = new Error('Redis get error');
      mockRedis.get.mockRejectedValueOnce(error);

      const result = await service.get(testKey);
      expect(logger.error).toHaveBeenCalledWith(`Error getting key ${testKey}:`, error);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set a key-value pair without TTL', async () => {
      const testKey = 'set-key';
      const testValue = { item: 'value' };
      mockRedis.set.mockResolvedValueOnce('OK');

      await service.set(testKey, testValue);
      expect(mockRedis.set).toHaveBeenCalledWith(testKey, JSON.stringify(testValue));
      expect(mockRedis.setex).not.toHaveBeenCalled();
    });

    it('should set a key-value pair with TTL', async () => {
      const testKey = 'setex-key';
      const testValue = [1, 2, 3];
      const ttl = 60;
      mockRedis.setex.mockResolvedValueOnce('OK');

      await service.set(testKey, testValue, ttl);
      expect(mockRedis.setex).toHaveBeenCalledWith(testKey, ttl, JSON.stringify(testValue));
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should log error if set fails', async () => {
      const testKey = 'error-set-key';
      const testValue = 'error-value';
      const error = new Error('Redis set error');
      mockRedis.set.mockRejectedValueOnce(error);

      await service.set(testKey, testValue);
      expect(logger.error).toHaveBeenCalledWith(`Error setting key ${testKey}:`, error);
    });
  });

  describe('del', () => {
    it('should delete a key', async () => {
      const testKey = 'delete-key';
      mockRedis.del.mockResolvedValueOnce(1);

      await service.del(testKey);
      expect(mockRedis.del).toHaveBeenCalledWith(testKey);
    });

    it('should log error if del fails', async () => {
      const testKey = 'error-delete-key';
      const error = new Error('Redis del error');
      mockRedis.del.mockRejectedValueOnce(error);

      await service.del(testKey);
      expect(logger.error).toHaveBeenCalledWith(`Error deleting key ${testKey}:`, error);
    });
  });

  describe('delPattern', () => {
    it('should delete keys matching a pattern', async () => {
      const pattern = 'prefix:*';
      const keysToDelete = ['prefix:1', 'prefix:2'];
      mockRedis.keys.mockResolvedValueOnce(keysToDelete);
      mockRedis.del.mockResolvedValueOnce(2);

      await service.delPattern(pattern);
      expect(mockRedis.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedis.del).toHaveBeenCalledWith(...keysToDelete);
    });

    it('should not call del if no keys match the pattern', async () => {
      const pattern = 'no-match:*';
      mockRedis.keys.mockResolvedValueOnce([]);

      await service.delPattern(pattern);
      expect(mockRedis.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should log error if delPattern fails', async () => {
      const pattern = 'error-pattern:*';
      const error = new Error('Redis keys error');
      mockRedis.keys.mockRejectedValueOnce(error);

      await service.delPattern(pattern);
      expect(logger.error).toHaveBeenCalledWith(`Error deleting pattern ${pattern}:`, error);
    });
  });

  describe('exists', () => {
    it('should return true if key exists', async () => {
      const testKey = 'exists-key';
      mockRedis.exists.mockResolvedValueOnce(1);

      const result = await service.exists(testKey);
      expect(mockRedis.exists).toHaveBeenCalledWith(testKey);
      expect(result).toBe(true);
    });

    it('should return false if key does not exist', async () => {
      const testKey = 'non-exists-key';
      mockRedis.exists.mockResolvedValueOnce(0);

      const result = await service.exists(testKey);
      expect(mockRedis.exists).toHaveBeenCalledWith(testKey);
      expect(result).toBe(false);
    });

    it('should log error and return false if exists fails', async () => {
      const testKey = 'error-exists-key';
      const error = new Error('Redis exists error');
      mockRedis.exists.mockRejectedValueOnce(error);

      const result = await service.exists(testKey);
      expect(logger.error).toHaveBeenCalledWith(`Error checking existence of key ${testKey}:`, error);
      expect(result).toBe(false);
    });
  });

  describe('flushAll', () => {
    it('should flush all keys', async () => {
      mockRedis.flushall.mockResolvedValueOnce('OK');

      await service.flushAll();
      expect(mockRedis.flushall).toHaveBeenCalledTimes(1);
    });

    it('should log error if flushAll fails', async () => {
      const error = new Error('Redis flushall error');
      mockRedis.flushall.mockRejectedValueOnce(error);

      await service.flushAll();
      expect(logger.error).toHaveBeenCalledWith('Error flushing all keys:', error);
    });
  });

  describe('onModuleDestroy', () => {
    it('should quit the Redis client', async () => {
      mockRedis.quit.mockResolvedValueOnce('OK');

      await service.onModuleDestroy();
      expect(mockRedis.quit).toHaveBeenCalledTimes(1);
    });
  });
});
