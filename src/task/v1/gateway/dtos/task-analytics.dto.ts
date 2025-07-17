import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskAnalytics } from '@/task/v1/domain/analytics/task-analytics';
import { TaskAnalyticsGranularityEnum } from '@/task/v1/domain/analytics/task-analytics.granularity';
import { IsDateString, IsNumber } from 'class-validator';

export class TaskAnalyticsDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  totalTasks!: number;

  @ApiProperty({ example: 75 })
  @IsNumber()
  completedTasks!: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  activeTasks!: number;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  averageEstimationHours!: number;

  @ApiProperty({ example: 15000.5 })
  @IsNumber()
  totalCostCompletedTasks!: number;

  @ApiProperty({ example: 640.0 })
  @IsNumber()
  totalEstimationHoursCompleted!: number;

  @ApiProperty({ example: 200.0 })
  @IsNumber()
  averageCostPerCompletedTask!: number;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: TaskAnalyticsGranularityEnum, example: TaskAnalyticsGranularityEnum.MONTH })
  granularity?: TaskAnalyticsGranularityEnum;

  static fromDomain(analytics: TaskAnalytics): TaskAnalyticsDto {
    const primitives = analytics.toPrimitives();

    const dto = new TaskAnalyticsDto();
    dto.totalTasks = primitives.totalTasks;
    dto.completedTasks = primitives.completedTasks;
    dto.activeTasks = primitives.activeTasks;
    dto.averageEstimationHours = primitives.averageEstimationHours;
    dto.totalCostCompletedTasks = primitives.totalCostCompletedTasks;
    dto.totalEstimationHoursCompleted = primitives.totalEstimationHoursCompleted;
    dto.averageCostPerCompletedTask = primitives.averageCostPerCompletedTask;
    dto.startDate = primitives.startDate;
    dto.endDate = primitives.endDate;
    dto.granularity = primitives.granularity;

    return dto;
  }
}
