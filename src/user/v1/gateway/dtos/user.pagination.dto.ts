import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { User, UserPrimitives } from '@/user/v1/domain/user/user';
import { Paginated } from '@/shared/domain/utils/Paginated';

export class UserPaginationDTO {
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
  public elements: UserPrimitives[];

  static fromDomain(paginated: Paginated<User>): UserPaginationDTO {
    return paginated.toPrimitives();
  }
}
