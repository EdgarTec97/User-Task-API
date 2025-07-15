import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

const isTs: boolean = Boolean(process.env.TS_NODE);

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [isTs ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
  migrations: [join(process.cwd(), 'migrations', isTs ? '*.ts' : '*.js')],

  migrationsTableName: 'typeorm_migrations',
});
