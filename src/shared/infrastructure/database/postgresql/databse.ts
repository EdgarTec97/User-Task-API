import { join } from 'path';
import { TypeOrmModuleOptions as Options } from '@nestjs/typeorm';
import { DATABASE } from '@/shared/infrastructure/config';
import { IDatabase } from '@/shared/domain/database/interface.database';

class PostgresDatabase implements IDatabase<Options> {
  private readonly database: typeof DATABASE.postgresql;
  private static instance: IDatabase<Options> | undefined;

  constructor() {
    this.database = DATABASE.postgresql;
  }

  /**
   * Singleton pattern to ensure only one instance of PostgresDatabase is created.
   * @returns {IDatabase<Options>} The singleton instance of PostgresDatabase.
   */
  static getInstance(): IDatabase<Options> {
    if (this.instance) return this.instance;
    this.instance = new PostgresDatabase();
    return this.instance;
  }

  public getDatabaseConfig(): Options {
    return {
      type: 'postgres',
      host: this.database.host,
      port: +this.database.port,
      username: this.database.user,
      password: this.database.password,
      database: this.database.database,
      entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
      logging: this.database.logging ? 'all' : false,
      maxQueryExecutionTime: 2000,
      //ssl: !this.database.logging,
      ssl: false,
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
    };
  }
}

export const DatabseInstance = PostgresDatabase.getInstance();
