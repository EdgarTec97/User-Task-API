import { Controller, Delete, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { DeleteTaskCommand } from '@/task/v1/application/use-cases/task-delete.use-case';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
export class DeleteTaskController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteTaskCommand(id));
  }
}
