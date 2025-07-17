import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserTypeOrmRepository } from '@/user/v1/infrastructure/repositories/user.typeorm.repository';

import { CreateUserController } from '@/user/v1/gateway/controllers/create-user.controller';
import { LoginUserController } from '@/user/v1/gateway/controllers/login-user.controller';
import { FindUserController } from '@/user/v1/gateway/controllers/find-user.controller';
import { MeUserController } from '@/user/v1/gateway/controllers/me-user.controller';
import { GetUserController } from '@/user/v1/gateway/controllers/get-user.controller';

import { UserCreateUseCase } from '@/user/v1/application/use-cases/user-create.use-case';
import { UserLoginUseCase } from '@/user/v1/application/use-cases/user-login.use-case';
import { UserFindUseCase } from '@/user/v1/application/use-cases/user-find.use-case';
import { UserFindOneUseCase } from '@/user/v1/application/use-cases/user-find-by.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CreateUserController, LoginUserController, FindUserController, MeUserController, GetUserController],
  providers: [
    UserCreateUseCase,
    UserLoginUseCase,
    UserFindUseCase,
    UserFindOneUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
