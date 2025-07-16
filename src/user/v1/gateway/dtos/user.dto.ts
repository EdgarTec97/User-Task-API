import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { User } from '@/user/v1/domain/user/user';
import { Role } from '@/shared/domain/jwt/Role';

export class UserDTO {
  @ApiProperty({ example: '6a2afbe5-267a-4de4-8d32-94eed09482cd' })
  @IsString()
  @IsOptional()
  public id: string;

  @ApiProperty({ example: 'User' })
  @IsString()
  public name: string;

  @ApiProperty({ example: 'user@user.com' })
  @IsEmail()
  public email: string;

  @ApiProperty({ example: '*****' })
  @IsString()
  public password: string;

  @ApiProperty({ example: Role.MEMBER })
  @IsEnum(Role)
  @IsOptional()
  public role: Role;

  static fromDomain(user: User): UserDTO {
    const { id, name, email, password, role } = user.toPrimitives();

    return { id, name, email, password, role };
  }
}
