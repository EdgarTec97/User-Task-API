import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig, ProducerConfig, ConsumerConfig } from 'kafkajs';
import { IBrokerConfigService } from '@/shared/domain/broker/config.service';

@Injectable()
export class KafkaConfigService implements IBrokerConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getBrokerConfig(): KafkaConfig {
    return {
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'nestjs-app'),
      brokers: this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 3000,
      requestTimeout: 30000,
      // PROD CONFIGURATION
      // ssl: {
      //   rejectUnauthorized: false,
      //   ca: atob(config.trustedCert),
      //   key: atob(config.clientCertKey),
      //   cert: atob(config.clientCert),
      // },
    };
  }

  public getProducerConfig(): ProducerConfig {
    return {
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
      retry: {
        initialRetryTime: 100,
        retries: 5,
      },
    };
  }

  public getConsumerConfig(groupId: string): ConsumerConfig {
    return {
      groupId,
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
      heartbeatInterval: 3000,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    };
  }

  public getTopics(): { EVENTS: string } {
    return {
      EVENTS: this.configService.get<string>('KAFKA_EVENTS_TOPIC', 'user.events'),
    };
  }
}
