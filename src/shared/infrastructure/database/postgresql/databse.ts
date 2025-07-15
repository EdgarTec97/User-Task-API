import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('POSTGRES_HOST'),
      port: +this.config.get<number>('POSTGRES_PORT')!,
      username: this.config.get('POSTGRES_USER'),
      password: this.config.get('POSTGRES_PASSWORD'),
      database: this.config.get('POSTGRES_DB'),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      migrationsTableName: 'typeorm_migrations',
      logging:
        this.config.get('PROJECT_MODE') === 'development' ? 'all' : false,
      maxQueryExecutionTime: 2000,
      synchronize: false,
      ssl: false,
    };
  }
}
