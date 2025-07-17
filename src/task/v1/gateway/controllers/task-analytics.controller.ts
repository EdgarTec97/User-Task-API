import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TaskAnalyticsUseCase } from '@/task/v1/application/use-cases/task-analytics.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

export interface TaskAnalyticsResult {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  averageEstimationHours: number;
  totalCostOfCompletedTasks: number;
  tasksCompletedThisMonth: number;
}

@Controller()
export class TaskAnalyticsController {
  constructor(private readonly useCase: TaskAnalyticsUseCase) {}

  @Endpoint({
    status: HttpStatus.OK,
    type: Object,
    description: 'Get task analytics',
    tags: [DocumentationTags.TASKS],
  })
  @ApiOkResponse({
    description: 'Task analytics data',
    schema: {
      type: 'object',
      properties: {
        totalTasks: { type: 'number', example: 100 },
        completedTasks: { type: 'number', example: 75 },
        activeTasks: { type: 'number', example: 25 },
        averageEstimationHours: { type: 'number', example: 8.5 },
        totalCostOfCompletedTasks: { type: 'number', example: 15000.5 },
        tasksCompletedThisMonth: { type: 'number', example: 12 },
      },
    },
  })
  @GuardWithJwt([Role.ADMIN])
  @Get('api/v1/task/analytics')
  async getAnalytics(): Promise<TaskAnalyticsResult> {
    const response: TaskAnalyticsResult = await this.useCase.execute();
    return response;
  }
}
