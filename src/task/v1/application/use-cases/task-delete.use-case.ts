import { Inject, Injectable } from '@nestjs/common';
import { TaskId } from '@/task/v1/domain/task/task.id';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';

@Injectable()
export class TaskDeleteUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(id: TaskId): Promise<void> {
    return await this.taskRepository.delete(id.valueOf());
  }
}
