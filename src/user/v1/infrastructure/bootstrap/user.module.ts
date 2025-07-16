import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserTypeOrmRepository } from '@/user/v1/infrastructure/repositories/user.typeorm.repository';

import { CreateUserController } from '@/user/v1/gateway/controllers/create-user.controller';
import { LoginUserController } from '@/user/v1/gateway/controllers/login-user.controller';

import { UserCreateUseCase } from '@/user/v1/application/use-cases/user-create.use-case';
import { UserLoginUseCase } from '@/user/v1/application/use-cases/user-login.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CreateUserController, LoginUserController],
  providers: [
    UserCreateUseCase,
    UserLoginUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
