import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DocumentationRoles } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('User - Task')
    .setDescription(
      'This project is a hands-on on how you can use hex architecture, DDD: Domain Driven Design and TDD: Test Driven Development in your future backend applications',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Member JWT',
      },
      DocumentationRoles.MEMBER_JWT,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Admin JWT',
      },
      DocumentationRoles.ADMIN_JWT,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  return port;
}

bootstrap()
  .then((port: number) => console.log(`Application is running on port:${port}`))
  .catch((error) => console.error('Error starting the application:', error));
