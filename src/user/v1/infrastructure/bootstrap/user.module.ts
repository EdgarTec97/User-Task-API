import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/user/v1/infrastructure/entities/user.entity';
import { USER_REPOSITORY } from '@/user/v1/domain/ports/user.repository';
import { UserTypeOrmRepository } from '@/user/v1/infrastructure/repositories/user.typeorm.repository';
import { UserCreateUseCase } from '@/user/v1/application/use-cases/use-create.use-case';
import { CreateUserController } from '@/user/v1/gateway/controllers/create-user.controller';

import { JWT_SERVICE_TOKEN } from '@/shared/domain/jwt/JwtService';
import { JwtServiceNest } from '@/shared/infrastructure/jwt/bootstrap/JwtServiceNest';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [CreateUserController],
  providers: [
    UserCreateUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    {
      provide: JWT_SERVICE_TOKEN,
      useClass: JwtServiceNest,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
