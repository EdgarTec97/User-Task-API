import { Inject, Injectable } from '@nestjs/common';
import { TASK_REPOSITORY, TaskRepository } from '@/task/v1/domain/ports/task.repository';
import { TaskAnalytics } from '@/task/v1/domain/analytics/task-analytics';
import { TaskAnalyticsStartDate } from '@/task/v1/domain/analytics/task-analytics.start-date';
import { TaskAnalyticsEndDate } from '@/task/v1/domain/analytics/task-analytics.end-date';
import { TaskAnalyticsGranularity } from '@/task/v1/domain/analytics/task-analytics.granularity';

@Injectable()
export class TaskAnalyticsUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
  ) {}

  async execute(
    startDate?: TaskAnalyticsStartDate,
    endDate?: TaskAnalyticsEndDate,
    granularity?: TaskAnalyticsGranularity,
  ): Promise<TaskAnalytics> {
    return await this.taskRepository.buildAnalytics(startDate, endDate, granularity);
  }
}
