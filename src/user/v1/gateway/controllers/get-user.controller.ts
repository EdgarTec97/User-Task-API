import { Controller, HttpStatus, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserFindOneUseCase } from '@/user/v1/application/use-cases/user-find-by.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { User } from '@/user/v1/domain/user/user';
import { UserDTO } from '@/user/v1/gateway/dtos/user.dto';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller({ path: 'api/v1/user', version: '1.0.0' })
export class GetUserController {
  constructor(private readonly useCase: UserFindOneUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'Get user',
    tags: [DocumentationTags.USERS],
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
    required: true,
  })
  @GuardWithJwt([Role.ADMIN])
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<UserDTO> {
    const userId: UserId = new UserId(id);

    const response: User = await this.useCase.execute(userId);

    return UserDTO.fromDomain(response);
  }
}
