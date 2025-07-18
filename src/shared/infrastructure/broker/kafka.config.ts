import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig, ProducerConfig, ConsumerConfig } from 'kafkajs';

@Injectable()
export class KafkaConfigService {
  constructor(private readonly configService: ConfigService) {}

  getKafkaConfig(): KafkaConfig {
    return {
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'nestjs-app'),
      brokers: this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 3000,
      requestTimeout: 30000,
    };
  }

  getProducerConfig(): ProducerConfig {
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

  getConsumerConfig(groupId: string): ConsumerConfig {
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

  getTopics() {
    return {
      USER_EVENTS: this.configService.get<string>('KAFKA_USER_EVENTS_TOPIC', 'user.events'),
    };
  }
}
