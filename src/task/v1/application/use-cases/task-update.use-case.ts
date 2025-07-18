import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task, TaskPrimitives } from '@/task/v1/domain/task/task';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { RedisService } from '@/shared/infrastructure/cache/redis.service';
import { CacheKeyGenerator } from '@/task/v1/infrastructure/cache/cache-key.generator';
import { CACHE_SERVICE } from '@/shared/domain/cache/cache.service';

@Injectable()
export class TaskUpdateUseCase {
  private readonly logger = new Logger(TaskUpdateUseCase.name);

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(CACHE_SERVICE)
    private readonly redisService: RedisService,
  ) {}

  async execute(task: Task): Promise<void> {
    const record = await this.taskRepository.findById(task.getId().valueOf());

    if (!record) throw new NotFoundException('Task not found.');

    const requestPrimitives: TaskPrimitives = task.toPrimitives();
    const dbPrimitives: TaskPrimitives = record.toPrimitives();

    await this.taskRepository.save({
      id: dbPrimitives.id,
      cost: requestPrimitives.cost ?? dbPrimitives.cost,
      description: requestPrimitives.description ?? dbPrimitives.description,
      dueDate: requestPrimitives.dueDate ?? dbPrimitives.dueDate,
      status: requestPrimitives.status ?? dbPrimitives.status,
      title: requestPrimitives.title ?? dbPrimitives.title,
      estimationHours: requestPrimitives.estimationHours ?? dbPrimitives.estimationHours,
      assignedUsers: requestPrimitives.assignedUsers ?? dbPrimitives.assignedUsers,
      createdAt: dbPrimitives.createdAt,
      updatedAt: requestPrimitives.updatedAt ?? dbPrimitives.updatedAt,
      users: [],
    });

    const pattern: string = CacheKeyGenerator.getTaskAnalyticsPattern();
    return await this.redisService.delPattern(pattern);
  }
}
