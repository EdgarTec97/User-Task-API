import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserTask, UserTaskPrimitives } from '@/user/v1/domain/user-task/user.task';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { UserPrimitives } from '@/user/v1/domain/user/user';

export class UserTaskPaginationDTO {
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
  public elements: (Omit<UserTaskPrimitives, 'user'> & { user: Omit<UserPrimitives, 'password'> })[];

  static fromDomain(paginated: Paginated<UserTask>): UserTaskPaginationDTO {
    const primitives: UserTaskPaginationDTO = paginated.toPrimitives();

    return primitives;
  }
}
