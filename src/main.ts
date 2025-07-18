import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@/app.module';
import { SwaggerAPI } from '@/shared/infrastructure/openapi/swagger.api';
import { AppClusterService } from '@/cluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;

  app.enableCors();

  SwaggerAPI.setup(app);

  await app.listen(port);
  return port;
}

AppClusterService.clusterize(bootstrap);
