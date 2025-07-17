import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';

@Injectable()
export class TaskAnalyticsUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(): Promise<any> {
    return await this.taskRepository.buildAnalytics();
  }
}
