import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  private readonly isProduction: boolean;

  constructor(private readonly config: ConfigService) {
    this.isProduction = config.get<string>('PROJECT_MODE') == 'production';
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('POSTGRES_HOST'),
      port: +this.config.get<number>('POSTGRES_PORT')!,
      username: this.config.get('POSTGRES_USER'),
      password: this.config.get('POSTGRES_PASSWORD'),
      database: this.config.get('POSTGRES_DB'),
      entities: [
        this.isProduction ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts',
      ],
      migrations: [
        join(process.cwd(), 'migrations', this.isProduction ? '*.js' : '*.ts'),
      ],
      migrationsTableName: 'typeorm_migrations',
      logging:
        this.config.get('PROJECT_MODE') === 'development' ? 'all' : false,
      maxQueryExecutionTime: 2000,
      synchronize: false,
      ssl: false,
    };
  }
}
