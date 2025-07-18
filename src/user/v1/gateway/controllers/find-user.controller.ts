import { Query, Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { UserPagination } from '@/user/v1/domain/pagination/user.pagination';
import { UserFindUseCase } from '@/user/v1/application/use-cases/user-find.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { User } from '@/user/v1/domain/user/user';
import { UserPaginationDTO } from '@/user/v1/gateway/dtos/user.pagination.dto';
import { FindParamsDTO } from '@/user/v1/gateway/dtos/find.params.dto';
import { Role } from '@/shared/domain/jwt/Role';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller({ path: 'api/v1/user', version: '1.0.0' })
export class FindUserController {
  constructor(private readonly useCase: UserFindUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: UserPaginationDTO,
    description: 'Find users',
    tags: [DocumentationTags.USERS],
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    type: Number,
    required: true,
    description: 'page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    example: 10,
    type: Number,
    required: true,
    description: 'number of items per page for pagination',
  })
  @ApiQuery({
    name: 'name',
    example: 'User',
    type: String,
    required: false,
    description: 'Filter users by name',
  })
  @ApiQuery({
    name: 'email',
    example: 'user@user.com',
    type: String,
    required: false,
    description: 'Filter users by email',
  })
  @ApiQuery({
    name: 'role',
    example: Role.MEMBER,
    type: String,
    required: false,
    description: 'Filter users by role',
  })
  @GuardWithJwt([Role.ADMIN])
  @Get()
  async getUsers(@Query() { email, name, page, pageSize, role }: FindParamsDTO): Promise<UserPaginationDTO> {
    const pagination: UserPagination = UserPagination.fromPrimitives({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      name: name || '',
      email: email || '',
      role: role,
    });

    const response: Paginated<User> = await this.useCase.execute(pagination);

    return UserPaginationDTO.fromDomain(response);
  }
}
