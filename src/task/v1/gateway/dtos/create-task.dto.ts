import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';

export class CreateTaskDto {
  @ApiProperty({ example: '6a2afbe5-267a-4de4-8d32-94eed09482cd' })
  @IsUUID('4')
  @IsOptional()
  public id: string;

  @ApiProperty({ example: 'title' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'description' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  estimationHours!: number;

  @ApiProperty({ example: '2025-07-17T20:47:46.795Z' })
  @IsDateString()
  dueDate!: string;

  @ApiProperty({ enum: TaskStatusEnum, example: TaskStatusEnum.ACTIVE })
  @IsEnum(TaskStatusEnum)
  status!: TaskStatusEnum;

  @ApiProperty({ type: [String], format: 'uuid', example: ['34eeede6-eb8b-4da8-981b-78a9a55b04a5'] })
  @IsArray()
  @IsUUID('4', { each: true })
  assignedUsers!: string[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  cost!: number;
}
