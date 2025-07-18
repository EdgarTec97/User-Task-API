import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { TaskAnalytics, TaskAnalyticsPrimitives } from '@/task/v1/domain/analytics/task-analytics';
import { TaskAnalyticsStartDate } from '@/task/v1/domain/analytics/task-analytics.start-date';
import { TaskAnalyticsEndDate } from '@/task/v1/domain/analytics/task-analytics.end-date';
import { TaskAnalyticsGranularity } from '@/task/v1/domain/analytics/task-analytics.granularity';
import { RedisService } from '@/shared/infrastructure/cache/redis.service';
import { CacheKeyGenerator } from '@/task/v1/infrastructure/cache/cache-key.generator';
import { CACHE_SERVICE } from '@/shared/domain/cache/cache.service';

@Injectable()
export class TaskAnalyticsUseCase {
  private readonly CACHE_TTL_SECONDS: number;

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(CACHE_SERVICE)
    private readonly redisService: RedisService,
  ) {
    this.CACHE_TTL_SECONDS = 300; // 5 minutes
  }

  async execute(
    startDate?: TaskAnalyticsStartDate,
    endDate?: TaskAnalyticsEndDate,
    granularity?: TaskAnalyticsGranularity,
  ): Promise<TaskAnalytics> {
    const cacheKey: string = CacheKeyGenerator.generateTaskAnalyticsKey(
      startDate?.valueOf(),
      endDate?.valueOf(),
      granularity?.valueOf(),
    );

    const cachedResult: TaskAnalyticsPrimitives | null = await this.redisService.get<TaskAnalyticsPrimitives>(cacheKey);

    if (cachedResult) return TaskAnalytics.fromPrimitives(cachedResult);

    const analytics: TaskAnalytics = await this.taskRepository.buildAnalytics(startDate, endDate, granularity);

    await this.redisService.set(cacheKey, analytics.toPrimitives(), this.CACHE_TTL_SECONDS);

    return analytics;
  }
}
