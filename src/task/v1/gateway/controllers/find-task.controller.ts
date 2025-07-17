import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FindTaskQuery } from '@/task/v1/application/use-cases/task-find.use-case';
import { FindTaskParamsDto } from '@/task/v1/gateway/dtos/find-task.params.dto';
import { TaskDto } from '@/task/v1/gateway/dtos/task.dto';

@ApiTags('Tasks')
@Controller({ path: 'tasks', version: '1' })
export class FindTaskController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOkResponse({ type: [TaskDto] })
  async find(@Query() params: FindTaskParamsDto): Promise<TaskDto[]> {
    const tasks = await this.queryBus.execute(
      new FindTaskQuery(
        0, // page
        100, // pageSize
        params.title,
        params.dueDate,
        params.assignedUser,
        params.assignedUserName,
        params.assignedUserEmail,
      ),
    );
    return tasks.map((task) => task.toPrimitives());
  }
}
