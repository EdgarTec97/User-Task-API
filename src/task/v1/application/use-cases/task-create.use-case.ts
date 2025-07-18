import { Inject, Injectable, Logger } from '@nestjs/common';
import { Task } from '@/task/v1/domain/task/task';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { RedisService } from '@/shared/infrastructure/cache/redis.service';
import { CacheKeyGenerator } from '@/task/v1/infrastructure/cache/cache-key.generator';
import { CACHE_SERVICE } from '@/shared/domain/cache/cache.service';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(CACHE_SERVICE)
    private readonly redisService: RedisService,
  ) {}

  async execute(task: Task): Promise<void> {
    await this.taskRepository.save(task.toPrimitives());

    const pattern: string = CacheKeyGenerator.getTaskAnalyticsPattern();
    return await this.redisService.delPattern(pattern);
  }
}
