import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 3000;
  await app.listen(port);
  return port;
}

bootstrap()
  .then((port: number) => console.log(`Application is running on port:${port}`))
  .catch((error) => console.error('Error starting the application:', error));
