import { Body, Controller, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Task } from '@/task/v1/domain/task/task';
import { TaskUpdateUseCase } from '@/task/v1/application/use-cases/task-update.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { UpdateTaskDto } from '@/task/v1/gateway/dtos/update-task.dto';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller()
export class UpdateTaskController {
  constructor(private readonly useCase: TaskUpdateUseCase) {}

  @Endpoint({
    status: HttpStatus.OK,
    type: StatusResponseDTO,
    description: 'Update a task',
    tags: [DocumentationTags.TASKS],
  })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Task data to update a record',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    type: String,
    required: true,
  })
  @Patch('api/v1/task/:id')
  @GuardWithJwt([Role.ADMIN, Role.MEMBER])
  async updateTask(
    @Body() { title, description, estimationHours, dueDate, status, cost, assignedUsers }: UpdateTaskDto,
    @Param('id') id: string,
  ): Promise<StatusResponseDTO> {
    const date: string = GeneralUtils.currentDate();

    await this.useCase.execute(
      Task.fromPrimitives({
        id,
        title: title!,
        description: description!,
        estimationHours: estimationHours!,
        dueDate: dueDate!,
        status: status!,
        cost: cost!,
        assignedUsers: assignedUsers!,
        users: [],
        createdAt: date,
        updatedAt: date,
      }),
    );

    return StatusResponseDTO.ok();
  }
}
