import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { UserEmail } from '@/user/v1/domain/user/user.email';
import { UserPassword } from '@/user/v1/domain/user/user.password';
import { UserLoginUseCase } from '@/user/v1/application/use-cases/user-login.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { LoginDTO } from '@/user/v1/gateway/dtos/login.dto';
import { tokenDTO } from '@/user/v1/gateway/dtos/token.dto';
import { TokenPair } from '@/shared/domain/tokens/TokenPair';

@Controller({ path: 'api/v1/user', version: '1.0.0' })
export class LoginUserController {
  constructor(private readonly useCase: UserLoginUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: LoginDTO,
    description: 'Authentication Workflow',
    tags: [DocumentationTags.USERS],
  })
  @ApiBody({
    type: LoginDTO,
    description: 'Login user with email and password',
  })
  @Post('/login')
  async loginUser(@Body() { email, password }: LoginDTO): Promise<tokenDTO> {
    const token: TokenPair = await this.useCase.execute(new UserEmail(email), new UserPassword(password));

    return token.toPrimitives();
  }
}
