import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { Task } from '@/task/v1/infrastructure/entities/task.entity';
import { USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserTypeOrmRepository } from '@/user/v1/infrastructure/repositories/user.typeorm.repository';

import { CreateUserController } from '@/user/v1/gateway/controllers/create-user.controller';
import { LoginUserController } from '@/user/v1/gateway/controllers/login-user.controller';
import { FindUserController } from '@/user/v1/gateway/controllers/find-user.controller';
import { MeUserController } from '@/user/v1/gateway/controllers/me-user.controller';
import { GetUserController } from '@/user/v1/gateway/controllers/get-user.controller';
import { UserUpdateController } from '@/user/v1/gateway/controllers/update-user.controller';
import { FindUserTaskController } from '@/user/v1/gateway/controllers/find-user-task.controller';

import { UserCreateUseCase } from '@/user/v1/application/use-cases/user-create.use-case';
import { UserLoginUseCase } from '@/user/v1/application/use-cases/user-login.use-case';
import { UserFindUseCase } from '@/user/v1/application/use-cases/user-find.use-case';
import { UserFindOneUseCase } from '@/user/v1/application/use-cases/user-find-by.use-case';
import { UserUpdateUseCase } from '@/user/v1/application/use-cases/user-update.use-case';
import { UserTaskFindUseCase } from '@/user/v1/application/use-cases/user-task-find.use.case';

import {
  UserCreatedBrokerPublisher,
  USER_PUBLISHER_BROKER,
} from '@/user/v1/infrastructure/events/user-created.broker-publisher';
import { UserCreatedBrokerSubscriber } from '@/user/v1/infrastructure/events/user-created.broker-subscriber';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Task])],
  controllers: [
    CreateUserController,
    LoginUserController,
    FindUserController,
    MeUserController,
    GetUserController,
    UserUpdateController,
    FindUserTaskController,
  ],
  providers: [
    UserCreateUseCase,
    UserLoginUseCase,
    UserFindUseCase,
    UserFindOneUseCase,
    UserUpdateUseCase,
    UserTaskFindUseCase,
    UserCreatedBrokerSubscriber,
    Logger,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: USER_PUBLISHER_BROKER,
      useClass: UserCreatedBrokerPublisher,
    },
  ],
  exports: [USER_REPOSITORY, USER_PUBLISHER_BROKER],
})
export class UserModule {}
