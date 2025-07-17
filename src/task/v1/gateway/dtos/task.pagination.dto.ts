import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Task, TaskPrimitives } from '@/task/v1/domain/task/task';
import { Paginated } from '@/shared/domain/utils/Paginated';

export class TaskPaginationDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  public page: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  public pageSize: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  public total: number;

  @ApiProperty({ example: [] })
  public elements: TaskPrimitives[];

  static fromDomain(paginated: Paginated<Task>): TaskPaginationDTO {
    const primitives: TaskPaginationDTO = paginated.toPrimitives();

    return primitives;
  }
}
