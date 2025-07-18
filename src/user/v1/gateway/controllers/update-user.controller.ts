import { Body, Controller, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { UserId } from '@/user/v1/domain/user/user.id';
import { UserName } from '@/user/v1/domain/user/user.name';
import { Role as RoleD } from '@/shared/domain/tokens/Role';
import { UserUpdateUseCase } from '@/user/v1/application/use-cases/user-update.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { UserUpdateDTO } from '@/user/v1/gateway/dtos/user.update.dto';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller({ path: 'api/v1/user', version: '1.0.0' })
export class UserUpdateController {
  constructor(private readonly useCase: UserUpdateUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: StatusResponseDTO,
    description: 'Update a user',
    tags: [DocumentationTags.USERS],
  })
  @ApiBody({
    type: UserUpdateDTO,
    description: 'User data to create a record',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the user',
    type: String,
    required: true,
  })
  @Patch('/:id')
  @GuardWithJwt([Role.ADMIN])
  async updateUser(@Body() { name, role }: UserUpdateDTO, @Param('id') id: string): Promise<StatusResponseDTO> {
    const userId: UserId = new UserId(id);

    const nameD: UserName | undefined = name ? new UserName(name) : undefined;
    const roleD: RoleD | undefined = role ? new RoleD(role) : undefined;

    await this.useCase.execute(userId, nameD, roleD);

    return StatusResponseDTO.ok();
  }
}
