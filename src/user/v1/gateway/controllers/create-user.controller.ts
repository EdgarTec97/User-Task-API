import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { User } from '@/user/v1/domain/user/user';
import { UserCreateUseCase } from '@/user/v1/application/use-cases/user-create.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { UserDTO } from '@/user/v1/gateway/dtos/user.dto';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';
import { Role } from '@/shared/domain/jwt/Role';

@Controller({ path: 'api/v1/user', version: '1.0.0' })
export class CreateUserController {
  constructor(private readonly useCase: UserCreateUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: StatusResponseDTO,
    description: 'Create a user',
    tags: [DocumentationTags.USERS],
  })
  @ApiBody({
    type: UserDTO,
    description: 'User data to create a record',
  })
  @Post()
  async execute(@Body() { name, email, password, id, role }: UserDTO): Promise<StatusResponseDTO> {
    const date: string = GeneralUtils.currentDate();
    const domain: User = User.fromPrimitives({
      id: id || GeneralUtils.uuid(),
      name,
      email,
      password,
      role: role || Role.MEMBER,
      createdAt: date,
      updatedAt: date,
    });

    await this.useCase.execute(domain);

    return StatusResponseDTO.ok();
  }
}
