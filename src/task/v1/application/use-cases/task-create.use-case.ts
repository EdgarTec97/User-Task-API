import { Inject, Injectable } from '@nestjs/common';
import { Task } from '@/task/v1/domain/task/task';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(task: Task): Promise<void> {
    return await this.taskRepository.save(task.toPrimitives());
  }
}
