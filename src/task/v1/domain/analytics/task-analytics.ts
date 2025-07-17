import { AggregateRoot } from '@/shared/domain/ddd/AggregateRoot';
import { TaskAnalyticsTotalTasks } from '@/task/v1/domain/analytics/task-analytics.total-tasks';
import { TaskAnalyticsCompletedTasks } from '@/task/v1/domain/analytics/task-analytics.completed-tasks';
import { TaskAnalyticsActiveTasks } from '@/task/v1/domain/analytics/task-analytics.active-tasks';
import { TaskAnalyticsAverageEstimationHours } from '@/task/v1/domain/analytics/task-analytics.average-estimation-hours';
import { TaskAnalyticsTotalCostCompletedTasks } from '@/task/v1/domain/analytics/task-analytics.total-cost-completed-tasks';
import { TaskAnalyticsTotalEstimationHoursCompleted } from '@/task/v1/domain/analytics/task-analytics.total-estimation-hours-completed';
import { TaskAnalyticsAverageCostPerCompletedTask } from '@/task/v1/domain/analytics/task-analytics.average-cost-per-completed-task';
import { TaskAnalyticsStartDate } from '@/task/v1/domain/analytics/task-analytics.start-date';
import { TaskAnalyticsEndDate } from '@/task/v1/domain/analytics/task-analytics.end-date';
import { TaskAnalyticsGranularity } from '@/task/v1/domain/analytics/task-analytics.granularity';

export type TaskAnalyticsPrimitives = ReturnType<TaskAnalytics['toPrimitives']>;

export class TaskAnalytics extends AggregateRoot {
  constructor(
    private readonly totalTasks: TaskAnalyticsTotalTasks,
    private readonly completedTasks: TaskAnalyticsCompletedTasks,
    private readonly activeTasks: TaskAnalyticsActiveTasks,
    private readonly averageEstimationHours: TaskAnalyticsAverageEstimationHours,
    private readonly totalCostCompletedTasks: TaskAnalyticsTotalCostCompletedTasks,
    private readonly totalEstimationHoursCompleted: TaskAnalyticsTotalEstimationHoursCompleted,
    private readonly averageCostPerCompletedTask: TaskAnalyticsAverageCostPerCompletedTask,
    private readonly startDate?: TaskAnalyticsStartDate,
    private readonly endDate?: TaskAnalyticsEndDate,
    private readonly granularity?: TaskAnalyticsGranularity,
  ) {
    super();
  }

  public static fromPrimitives(p: TaskAnalyticsPrimitives): TaskAnalytics {
    return new TaskAnalytics(
      new TaskAnalyticsTotalTasks(p.totalTasks),
      new TaskAnalyticsCompletedTasks(p.completedTasks),
      new TaskAnalyticsActiveTasks(p.activeTasks),
      new TaskAnalyticsAverageEstimationHours(p.averageEstimationHours),
      new TaskAnalyticsTotalCostCompletedTasks(p.totalCostCompletedTasks),
      new TaskAnalyticsTotalEstimationHoursCompleted(p.totalEstimationHoursCompleted),
      new TaskAnalyticsAverageCostPerCompletedTask(p.averageCostPerCompletedTask),
      p.startDate ? new TaskAnalyticsStartDate(p.startDate) : undefined,
      p.endDate ? new TaskAnalyticsEndDate(p.endDate) : undefined,
      p.granularity ? new TaskAnalyticsGranularity(p.granularity) : undefined,
    );
  }

  toPrimitives() {
    return {
      totalTasks: this.totalTasks.valueOf(),
      completedTasks: this.completedTasks.valueOf(),
      activeTasks: this.activeTasks.valueOf(),
      averageEstimationHours: this.averageEstimationHours.valueOf(),
      totalCostCompletedTasks: this.totalCostCompletedTasks.valueOf(),
      totalEstimationHoursCompleted: this.totalEstimationHoursCompleted.valueOf(),
      averageCostPerCompletedTask: this.averageCostPerCompletedTask.valueOf(),
      startDate: this.startDate?.valueOf(),
      endDate: this.endDate?.valueOf(),
      granularity: this.granularity?.valueOf(),
    };
  }
}
