import { Controller, HttpStatus, Get, Req } from '@nestjs/common';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserFindOneUseCase } from '@/user/v1/application/use-cases/user-find-by.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { User } from '@/user/v1/domain/user/user';
import { UserDTO } from '@/user/v1/gateway/dtos/user.dto';
import type { JwtPayload } from '@/shared/domain/jwt/JwtPayload';
import { ALL_ROLES } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller()
export class MeUserController {
  constructor(private readonly useCase: UserFindOneUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'Find users',
    tags: [DocumentationTags.USERS],
  })
  //   @ApiParam({
  //     name: 'id',
  //     description: 'The unique identifier of the cat',
  //     type: String,
  //     required: true,
  //   })
  @GuardWithJwt(ALL_ROLES)
  @Get('api/v1/user/me')
  async getUser(@Req() req: Request & { jwtPayload: JwtPayload }): Promise<UserDTO> {
    const userId: UserId = new UserId(req.jwtPayload.id);

    const response: User = await this.useCase.execute(userId);

    return UserDTO.fromDomain(response);
  }
}
