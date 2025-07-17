import { Body, Controller, Param, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { UpdateTaskCommand } from '@/task/v1/application/use-cases/task-update.use-case';
import { UpdateTaskDto } from '@/task/v1/gateway/dtos/update-task.dto';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
export class UpdateTaskController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<void> {
    await this.commandBus.execute(
      new UpdateTaskCommand(
        id,
        dto.title,
        dto.description,
        dto.estimationHours,
        dto.dueDate,
        dto.status,
        dto.assignedUsers,
        dto.cost,
      ),
    );
  }
}
