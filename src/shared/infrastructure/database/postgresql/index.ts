import {
  PostgresDatabase,
  type Options,
} from '@/shared/infrastructure/database/postgresql/databse';
import { IDatabase } from '@/shared/domain/database/interface.database';

export const DatabseInstance: IDatabase<Options> =
  PostgresDatabase.getInstance();
