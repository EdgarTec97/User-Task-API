import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabseInstance } from '@/shared/infrastructure/database/postgresql/databse';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => DatabseInstance.getDatabaseConfig(),
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
