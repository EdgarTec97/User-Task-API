import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { TaskAnalyticsUseCase } from '@/task/v1/application/use-cases/task-analytics.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';
import { TaskAnalyticsParamsDto } from '@/task/v1/gateway/dtos/task-analytics.params.dto';
import { TaskAnalyticsDto } from '@/task/v1/gateway/dtos/task-analytics.dto';
import { TaskAnalyticsStartDate } from '@/task/v1/domain/analytics/task-analytics.start-date';
import { TaskAnalyticsEndDate } from '@/task/v1/domain/analytics/task-analytics.end-date';
import {
  TaskAnalyticsGranularity,
  TaskAnalyticsGranularityEnum,
} from '@/task/v1/domain/analytics/task-analytics.granularity';

@Controller()
export class TaskAnalyticsController {
  constructor(private readonly useCase: TaskAnalyticsUseCase) {}

  @Endpoint({
    status: HttpStatus.OK,
    type: TaskAnalyticsDto,
    description: 'Get task analytics',
    tags: [DocumentationTags.TASKS],
  })
  @ApiQuery({
    name: 'startDate',
    example: '2023-01-01',
    type: String,
    required: false,
    description: 'Start date for analytics filtering',
  })
  @ApiQuery({
    name: 'endDate',
    example: '2023-12-31',
    type: String,
    required: false,
    description: 'End date for analytics filtering',
  })
  @ApiQuery({
    name: 'granularity',
    enum: TaskAnalyticsGranularityEnum,
    example: TaskAnalyticsGranularityEnum.MONTH,
    required: false,
    description: 'Granularity for analytics aggregation',
  })
  @ApiOkResponse({
    description: 'Task analytics data',
    type: TaskAnalyticsDto,
  })
  @GuardWithJwt([Role.ADMIN])
  @Get('api/v1/task/analytics')
  async getAnalytics(@Query() { startDate, endDate, granularity }: TaskAnalyticsParamsDto): Promise<TaskAnalyticsDto> {
    const startDateD: TaskAnalyticsStartDate | undefined = startDate
      ? new TaskAnalyticsStartDate(startDate)
      : undefined;
    const endDateD: TaskAnalyticsEndDate | undefined = endDate ? new TaskAnalyticsEndDate(endDate) : undefined;
    const granularityD: TaskAnalyticsGranularity | undefined = granularity
      ? new TaskAnalyticsGranularity(granularity)
      : undefined;

    const analytics = await this.useCase.execute(startDateD, endDateD, granularityD);

    return TaskAnalyticsDto.fromDomain(analytics);
  }
}
