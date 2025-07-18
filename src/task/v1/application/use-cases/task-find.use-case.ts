import { Inject, Injectable } from '@nestjs/common';
import { Task } from '@/task/v1/domain/task/task';
import { TaskPagination } from '@/task/v1/domain/pagination/task.pagination';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { Paginated } from '@/shared/domain/utils/Paginated';

@Injectable()
export class TaskFindUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(pagination: TaskPagination): Promise<Paginated<Task>> {
    return this.taskRepository.findAll(pagination.toPrimitives());
  }
}
