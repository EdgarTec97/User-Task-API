import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { LoggingModule } from '@/shared/infrastructure/logging/logging.module';
import { DatabaseModule } from '@/shared/infrastructure/database/module';
import { HttpExceptionFilterLogger } from '@/shared/infrastructure/error-handling/boilerplate/HttpExceptionFilterLogger';
import { GlobalErrorsInterceptor } from '@/shared/infrastructure/error-handling/boilerplate/GlobalErrorsInterceptor';
import { DomainToInfrastructureMapper } from '@/shared/infrastructure/error-handling/DomainToInfrastructureMap';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }), LoggingModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalErrorsInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilterLogger,
    },
    DomainToInfrastructureMapper,
  ],
})
export class AppModule {}
