import { Controller, Delete, HttpStatus, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { TaskId } from '@/task/v1/domain/task/task.id';
import { TaskDeleteUseCase } from '@/task/v1/application/use-cases/task-delete.use-case';
import { DocumentationTags, Endpoint } from '@/shared/infrastructure/utils/Endpoint';
import { StatusResponseDTO } from '@/shared/infrastructure/meta/dtos/StatusResponseDTO';
import { Role } from '@/shared/domain/jwt/Role';
import { GuardWithJwt } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

@Controller()
export class DeleteTaskController {
  constructor(private readonly useCase: TaskDeleteUseCase) {}

  @Endpoint({
    status: HttpStatus.OK,
    type: StatusResponseDTO,
    description: 'Delete a task',
    tags: [DocumentationTags.TASKS],
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the task',
    type: String,
    required: true,
  })
  @Delete('api/v1/task/:id')
  @GuardWithJwt([Role.ADMIN])
  async deleteTask(@Param('id') id: string): Promise<StatusResponseDTO> {
    const taskId: TaskId = new TaskId(id);

    await this.useCase.execute(taskId);

    return StatusResponseDTO.ok();
  }
}
