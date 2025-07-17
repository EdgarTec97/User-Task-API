import { Query, Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { UserPagination } from '@/user/v1/domain/pagination/user.pagination';
import { UserTaskFindUseCase } from '@/user/v1/application/use-cases/user-task-find.use.case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { UserTask } from '@/user/v1/domain/user-task/user.task';
import { UserTaskPaginationDTO } from '@/user/v1/gateway/dtos/user.task.pagination.dto';
import { FindParamsDTO } from '@/user/v1/gateway/dtos/find.params.dto';
import { Role } from '@/shared/domain/jwt/Role';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller({ path: 'api/v1/user', version: '1.0.0' })
export class FindUserTaskController {
  constructor(private readonly useCase: UserTaskFindUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: UserTaskPaginationDTO,
    description: 'Find users-tasks',
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
  @Get('/task')
  async getUsers(@Query() { email, name, page, pageSize, role }: FindParamsDTO): Promise<UserTaskPaginationDTO> {
    const pagination: UserPagination = UserPagination.fromPrimitives({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      name: name || '',
      email: email || '',
      role: role,
    });

    const response: Paginated<UserTask> = await this.useCase.execute(pagination);

    return UserTaskPaginationDTO.fromDomain(response);
  }
}
