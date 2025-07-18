import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TaskAnalyticsGranularityEnum } from '@/task/v1/domain/analytics/task-analytics.granularity';

export class TaskAnalyticsParamsDto {
  @ApiPropertyOptional({
    description: 'Start date for analytics filtering',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for analytics filtering',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Granularity for analytics aggregation',
    enum: TaskAnalyticsGranularityEnum,
    example: TaskAnalyticsGranularityEnum.MONTH,
  })
  @IsOptional()
  @IsEnum(TaskAnalyticsGranularityEnum)
  granularity?: TaskAnalyticsGranularityEnum;
}
