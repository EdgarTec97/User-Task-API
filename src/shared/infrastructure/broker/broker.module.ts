import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from '@/shared/infrastructure/broker/kafka.service';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';
import { BROKER_SERVICE_TOKEN } from '@/shared/domain/broker/broker.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: BROKER_SERVICE_TOKEN,
      useExisting: KafkaService,
    },
    KafkaService,
    Logger,
  ],
  exports: [KafkaService, KafkaConfigService, BROKER_SERVICE_TOKEN],
})
export class BrokerModule {}
