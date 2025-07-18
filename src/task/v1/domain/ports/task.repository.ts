import { Task, TaskPrimitives } from '@/task/v1/domain/task/task';
import { TaskPaginationPrimitives } from '@/task/v1/domain/pagination/task.pagination';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { TaskAnalytics } from '@/task/v1/domain/analytics/task-analytics';
import { TaskAnalyticsStartDate } from '@/task/v1/domain/analytics/task-analytics.start-date';
import { TaskAnalyticsEndDate } from '@/task/v1/domain/analytics/task-analytics.end-date';
import { TaskAnalyticsGranularity } from '@/task/v1/domain/analytics/task-analytics.granularity';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface TaskRepository {
  save(task: TaskPrimitives): Promise<void>;
  findById(id: string): Promise<Task | void>;
  findAll(pagination: TaskPaginationPrimitives): Promise<Paginated<Task>>;
  delete(id: string): Promise<void>;
  buildAnalytics(
    startDate?: TaskAnalyticsStartDate,
    endDate?: TaskAnalyticsEndDate,
    granularity?: TaskAnalyticsGranularity,
  ): Promise<TaskAnalytics>;
}
