import type { EachMessagePayload } from '@/shared/domain/broker/primitives';

export interface KafkaMessage {
  topic: string;
  key?: string;
  value: string;
  headers?: Record<string, string>;
  partition?: number;
}

export interface KafkaSubscriptionOptions {
  topic: string;
  groupId: string;
  fromBeginning?: boolean;
}

export const BROKER_SERVICE_TOKEN = Symbol.for('BROKER_SERVICE_TOKEN');

export interface IBrokerService {
  publish(message: KafkaMessage): Promise<void>;
  subscribe(
    options: KafkaSubscriptionOptions,
    messageHandler: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<void>;
  createTopics(topics: Array<{ topic: string; numPartitions?: number; replicationFactor?: number }>): Promise<void>;
}
