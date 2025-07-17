import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { CreateTaskUseCase } from '@/task/v1/application/use-cases/task-create.use-case';
import { CreateTaskDto } from '@/task/v1/gateway/dtos/create-task.dto';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';
import { Task } from '@/task/v1/domain/task/task';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller({ path: '/api/v1/task', version: '1.0.0' })
export class CreateTaskController {
  constructor(private readonly useCase: CreateTaskUseCase) {}

  @Endpoint({
    status: HttpStatus.CREATED,
    type: StatusResponseDTO,
    description: 'Create a Task',
    tags: [DocumentationTags.TASKS],
  })
  @ApiBody({
    type: CreateTaskDto,
    description: 'Task data to create a record',
  })
  @GuardWithJwt([Role.ADMIN])
  @Post()
  async create(@Body() taskDto: CreateTaskDto): Promise<StatusResponseDTO> {
    const date: string = GeneralUtils.currentDate();
    const domain: Task = Task.fromPrimitives({
      ...taskDto,
      id: taskDto.id || GeneralUtils.uuid(),
      users: [],
      createdAt: date,
      updatedAt: date,
    });

    await this.useCase.execute(domain);

    return StatusResponseDTO.ok();
  }
}
