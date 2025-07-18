import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';

export class FindTaskParamsDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsString()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 20 })
  @IsString()
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value === '' ? undefined : value))
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value === '' ? undefined : value))
  endDate?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value === '' ? undefined : value))
  assignedUser?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedUserName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedUserEmail?: string;

  @ApiPropertyOptional({ enum: TaskStatusEnum, example: TaskStatusEnum.ACTIVE })
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status!: TaskStatusEnum;
}
