import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { Task } from '@/task/v1/infrastructure/entities/task.entity';
import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { TASK_REPOSITORY } from '@/task/v1/domain/ports/task.repository';
import { TaskTypeOrmRepository } from '@/task/v1/infrastructure/repositories/task.typeorm.repository';

import { CreateTaskController } from '@/task/v1/gateway/controllers/create-task.controller';
import { FindTaskController } from '@/task/v1/gateway/controllers/find-task.controller';
import { UpdateTaskController } from '@/task/v1/gateway/controllers/update-task.controller';
import { DeleteTaskController } from '@/task/v1/gateway/controllers/delete-task.controller';
import { TaskAnalyticsController } from '@/task/v1/gateway/controllers/task-analytics.controller';

import { CreateTaskUseCase } from '@/task/v1/application/use-cases/task-create.use-case';
import { TaskFindUseCase } from '@/task/v1/application/use-cases/task-find.use-case';
import { TaskUpdateUseCase } from '@/task/v1/application/use-cases/task-update.use-case';
import { TaskDeleteUseCase } from '@/task/v1/application/use-cases/task-delete.use-case';
import { TaskAnalyticsUseCase } from '@/task/v1/application/use-cases/task-analytics.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), CqrsModule],
  controllers: [
    CreateTaskController,
    FindTaskController,
    UpdateTaskController,
    DeleteTaskController,
    TaskAnalyticsController,
  ],
  providers: [
    CreateTaskUseCase,
    TaskFindUseCase,
    TaskUpdateUseCase,
    TaskDeleteUseCase,
    TaskAnalyticsUseCase,
    {
      provide: TASK_REPOSITORY,
      useClass: TaskTypeOrmRepository,
    },
  ],
  exports: [TASK_REPOSITORY],
})
export class TaskModule {}
