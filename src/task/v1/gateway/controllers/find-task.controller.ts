import { Query, Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { TaskPagination, TaskPaginationPrimitives } from '@/task/v1/domain/pagination/task.pagination';
import { TaskFindUseCase } from '@/task/v1/application/use-cases/task-find.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { Task } from '@/task/v1/domain/task/task';
import { TaskPaginationDTO } from '@/task/v1/gateway/dtos/task.pagination.dto';
import { FindTaskParamsDto } from '@/task/v1/gateway/dtos/find-task.params.dto';
import { Paginated } from '@/shared/domain/utils/Paginated';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller({ path: '/api/v1/task', version: '1.0.0' })
export class FindTaskController {
  constructor(private readonly useCase: TaskFindUseCase) {}

  @Endpoint({
    status: HttpStatus.OK,
    type: TaskPaginationDTO,
    description: 'Find tasks',
    tags: [DocumentationTags.TASKS],
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
    name: 'title',
    example: 'Task Title',
    type: String,
    required: false,
    description: 'Filter tasks by title',
  })
  @ApiQuery({
    name: 'dueDate',
    example: '2025-07-17T21:56:17.245Z',
    type: String,
    required: false,
    description: 'Filter tasks by due date',
  })
  @ApiQuery({
    name: 'assignedUser',
    example: '6a2afbe5-267a-4de4-8d32-94eed09482cd',
    type: String,
    required: false,
    description: 'Filter tasks by assigned user ID',
  })
  @ApiQuery({
    name: 'assignedUserName',
    example: 'John Doe',
    type: String,
    required: false,
    description: 'Filter tasks by assigned user name',
  })
  @ApiQuery({
    name: 'assignedUserEmail',
    example: 'john@example.com',
    type: String,
    required: false,
    description: 'Filter tasks by assigned user email',
  })
  @GuardWithJwt([Role.ADMIN, Role.MEMBER])
  @Get()
  async getTasks(
    @Query()
    params: FindTaskParamsDto,
  ): Promise<TaskPaginationDTO> {
    const pagination: TaskPagination = TaskPagination.fromPrimitives({
      ...params,
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize) || 10,
    } as TaskPaginationPrimitives);

    const response: Paginated<Task> = await this.useCase.execute(pagination);

    return TaskPaginationDTO.fromDomain(response);
  }
}
