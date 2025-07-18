import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { User } from '@/user/v1/domain/user/user';
import { Role } from '@/shared/domain/jwt/Role';

export class UserDTO {
  @ApiProperty({ example: '6a2afbe5-267a-4de4-8d32-94eed09482cd' })
  @IsUUID('4')
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

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  @IsString()
  @IsOptional()
  public createdAt?: string;

  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  @IsString()
  @IsOptional()
  public updatedAt?: string;

  static fromDomain(user: User): UserDTO {
    const { id, name, email, role, createdAt, updatedAt } = user.toPrimitives();

    return { id, name, email, role, createdAt, updatedAt } as UserDTO;
  }
}
