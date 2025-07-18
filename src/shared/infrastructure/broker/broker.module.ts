import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from '@/shared/infrastructure/broker/kafka.service';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';
import { BROKER_SERVICE_TOKEN } from '@/shared/domain/broker/broker.service';
import { BROKER_CONFIG_TOKEN } from '@/shared/domain/broker/config.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    KafkaConfigService,
    {
      provide: BROKER_CONFIG_TOKEN,
      useExisting: KafkaConfigService,
    },
    KafkaService,
    {
      provide: BROKER_SERVICE_TOKEN,
      useExisting: KafkaService,
    },
    Logger,
  ],
  exports: [BROKER_CONFIG_TOKEN, BROKER_SERVICE_TOKEN],
})
export class BrokerModule {}
