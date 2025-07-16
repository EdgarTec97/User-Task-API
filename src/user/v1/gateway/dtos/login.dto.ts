import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { UserPassword } from '@/user/v1/domain/user/user.password';

export class LoginDTO {
  @ApiProperty({ example: 'user@user.com' })
  @IsEmail()
  public email: string;

  @ApiProperty({ example: '*****' })
  @IsString()
  public password: string;

  static fromDomain(email: UserEmail, password: UserPassword): LoginDTO {
    return { email: email.valueOf(), password: password.valueOf() };
  }
}
