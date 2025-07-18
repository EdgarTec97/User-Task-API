import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';

export class TaskDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  estimationHours!: number;

  @ApiProperty()
  dueDate!: Date;

  @ApiProperty({ enum: TaskStatusEnum })
  status!: TaskStatusEnum;

  @ApiProperty({ type: [String], format: 'uuid' })
  assignedUsers!: string[];

  @ApiProperty()
  cost!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
