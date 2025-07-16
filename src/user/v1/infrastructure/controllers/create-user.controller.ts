import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { User } from '@/user/v1/domain/user/user';
import { UserCreateUseCase } from '@/user/v1/application/use-cases/use-create.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { UserDTO } from '@/user/v1/infrastructure/dtos/user.dto';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { Generate } from '@/shared/infrastructure/utils/generate';
import { Role } from '@/shared/domain/jwt/Role';

@Controller()
export class CreateUserController {
  constructor(private readonly useCase: UserCreateUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: UserDTO,
    description: 'Create a user',
    tags: [DocumentationTags.USERS],
  })
  @ApiBody({
    type: UserDTO,
    description: 'User data to create a record',
  })
  @Post('api/v1/user')
  async createStudent(@Body() { name, email, password, id, role }: UserDTO): Promise<StatusResponseDTO> {
    const domain: User = User.fromPrimitives({
      id: id || Generate.uuid(),
      name,
      email,
      password,
      role: role || Role.MEMBER,
      createdAt: Generate.currentDate(),
      updatedAt: Generate.currentDate(),
    });

    await this.useCase.execute(domain);

    return StatusResponseDTO.ok();
  }
}
