import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaService } from '@/shared/infrastructure/broker/kafka.service';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [KafkaConfigService, KafkaService, Logger],
  exports: [KafkaService, KafkaConfigService],
})
export class BrokerModule {}
