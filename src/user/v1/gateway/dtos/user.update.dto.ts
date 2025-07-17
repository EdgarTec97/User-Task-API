import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@/shared/domain/jwt/Role';

export class UserUpdateDTO {
  @ApiProperty({ example: 'User' })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({ example: Role.MEMBER })
  @IsEnum(Role)
  @IsOptional()
  public role: Role;
}
