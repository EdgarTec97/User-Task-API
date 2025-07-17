import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@/shared/domain/jwt/Role';

export class FindParamsDTO {
  @ApiProperty({ example: 1, minimum: 1 })
  @IsString()
  page: number;

  @ApiProperty({ example: 10, minimum: 1, maximum: 20 })
  @IsString()
  pageSize: number;

  @ApiProperty({ example: 'name' })
  @IsString()
  @IsOptional()
  public name: string;

  @ApiProperty({ example: 'email@email.com' })
  @IsString()
  @IsOptional()
  public email: string;

  @ApiProperty({ example: Role.MEMBER })
  @IsEnum(Role)
  @IsOptional()
  public role: Role;
}
