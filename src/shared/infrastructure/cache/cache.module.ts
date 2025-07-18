import { Global, Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from '@/shared/infrastructure/cache/redis.service';
import { CACHE_SERVICE } from '@/shared/domain/cache/cache.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    Logger,
    {
      provide: CACHE_SERVICE,
      useExisting: RedisService,
    },
  ],

  exports: [CACHE_SERVICE],
})
export class CacheModule {}
