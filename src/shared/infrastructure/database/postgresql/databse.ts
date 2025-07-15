import { join } from 'path';
import { TypeOrmModuleOptions as Options } from '@nestjs/typeorm';
import { DATABASE, PROJECT } from '@/shared/infrastructure/config';
import { IDatabase } from '@/shared/domain/database/interface.database';
export type { Options };

export class PostgresDatabase implements IDatabase<Options> {
  private readonly database: typeof DATABASE.postgresql;
  private readonly project: typeof PROJECT;
  private static instance: IDatabase<Options> | undefined;

  constructor() {
    this.database = DATABASE.postgresql;
    this.project = PROJECT;
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
    console.info(this.database);
    return {
      type: 'postgres',
      host: this.database.host,
      port: +this.database.port,
      username: this.database.user,
      password: this.database.password,
      database: this.database.database,
      entities: [
        !this.project.production ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js',
      ],
      migrations: [
        join(
          process.cwd(),
          'migrations',
          !this.project.production ? '*.ts' : '*.js',
        ),
      ],
      logging: this.database.logging ? 'all' : false,
      maxQueryExecutionTime: 2000,
      //ssl: !this.database.logging,
      ssl: false,
      migrationsTableName: 'typeorm_migrations',
      synchronize: false,
    };
  }
}
