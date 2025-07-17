import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev: boolean = config.get<string>('PROJECT_MODE') === 'development';
        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            transport: isDev ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
          },
        };
      },
    }),
  ],
})
export class LoggingModule {}
