import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TaskAnalyticsQuery, TaskAnalyticsResult } from '@/task/v1/application/use-cases/task-analytics.use-case';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
export class TaskAnalyticsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('analytics')
  @ApiOkResponse({ 
    description: 'Task analytics data',
    schema: {
      type: 'object',
      properties: {
        totalTasks: { type: 'number', example: 100 },
        completedTasks: { type: 'number', example: 75 },
        activeTasks: { type: 'number', example: 25 },
        averageEstimationHours: { type: 'number', example: 8.5 },
        totalCostOfCompletedTasks: { type: 'number', example: 15000.50 },
        tasksCompletedThisMonth: { type: 'number', example: 12 },
      }
    }
  })
  async getAnalytics(): Promise<TaskAnalyticsResult> {
    return await this.queryBus.execute(new TaskAnalyticsQuery());
  }
}

