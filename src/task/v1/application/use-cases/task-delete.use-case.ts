import { Inject, Injectable } from '@nestjs/common';
import { TaskId } from '@/task/v1/domain/task/task.id';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { RedisService } from '@/shared/infrastructure/cache/redis.service';
import { CacheKeyGenerator } from '@/task/v1/infrastructure/cache/cache-key.generator';
import { CACHE_SERVICE } from '@/shared/domain/cache/cache.service';

@Injectable()
export class TaskDeleteUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(CACHE_SERVICE)
    private readonly redisService: RedisService,
  ) {}

  async execute(id: TaskId): Promise<void> {
    await this.taskRepository.delete(id.valueOf());

    const pattern: string = CacheKeyGenerator.getTaskAnalyticsPattern();
    return await this.redisService.delPattern(pattern);
  }
}
