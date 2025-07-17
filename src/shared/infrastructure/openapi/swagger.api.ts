import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { DocumentationRoles } from '@/shared/infrastructure/jwt/bootstrap/JwtAuthGuard';

export class SwaggerAPI {
  private document: OpenAPIObject;
  private readonly builder: DocumentBuilder;
  private static instance: SwaggerAPI | undefined;

  private constructor(private readonly application: INestApplication) {
    this.builder = this.buildOptions();
    this.document = SwaggerModule.createDocument(application, this.builder.build());
  }

  public register(): void {
    SwaggerModule.setup('api', this.application, this.document);
  }

  public static setup(application: INestApplication): void {
    if (!SwaggerAPI.instance) {
      SwaggerAPI.instance = new SwaggerAPI(application);
    }
    SwaggerAPI.instance.register();
  }

  private buildOptions(): DocumentBuilder {
    return new DocumentBuilder()
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
      );
  }
}
