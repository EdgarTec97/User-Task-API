import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';
import { IBrokerService, KafkaMessage, KafkaSubscriptionOptions } from '@/shared/domain/broker/broker.service';
import { BROKER_CONFIG_TOKEN } from '@/shared/domain/broker/config.service';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy, IBrokerService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor(
    @Inject(BROKER_CONFIG_TOKEN)
    private readonly brokerConfig: KafkaConfigService,
    private readonly logger: Logger,
  ) {
    this.kafka = new Kafka(this.brokerConfig.getBrokerConfig());
    this.producer = this.kafka.producer(this.brokerConfig.getProducerConfig());
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully', KafkaService.name);
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.producer.disconnect();

      for (const [groupId, consumer] of this.consumers) {
        await consumer.disconnect();
        this.logger.log(`Kafka consumer for group ${groupId} disconnected`, KafkaService.name);
      }

      this.logger.log('Kafka connections closed', KafkaService.name);
    } catch (error) {
      this.logger.error('Error closing Kafka connections:', error);
    }
  }

  async publish(message: KafkaMessage): Promise<void> {
    try {
      const result = await this.producer.send({
        topic: message.topic,
        messages: [
          {
            key: message.key,
            value: message.value,
            headers: message.headers,
            partition: message.partition,
            timestamp: Date.now().toString(),
          },
        ],
      });

      this.logger.debug(`Message published to topic ${message.topic}:`, result);
    } catch (error) {
      this.logger.error(`Failed to publish message to topic ${message.topic}:`, error);
      throw error;
    }
  }

  async subscribe(
    options: KafkaSubscriptionOptions,
    messageHandler: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<void> {
    const { topic, groupId, fromBeginning = false } = options;

    if (this.consumers.has(groupId)) {
      this.logger.warn(`Consumer for group ${groupId} already exists`, KafkaService.name);
      return;
    }

    try {
      const consumer = this.kafka.consumer(this.brokerConfig.getConsumerConfig(groupId));

      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning });

      await consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          try {
            this.logger.debug(
              `Received message from topic ${topic}, partition ${payload.partition}`,
              KafkaService.name,
            );
            await messageHandler(payload);
          } catch (error) {
            this.logger.error(`Error processing message from topic ${topic}:`, error);
            // Implement dead letter queue or retry logic here if needed
          }
        },
      });

      this.consumers.set(groupId, consumer);
      this.logger.log(`Kafka consumer for group ${groupId} subscribed to topic ${topic}`, KafkaService.name);
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${topic} with group ${groupId}:`, error);
      throw error;
    }
  }

  async createTopics(
    topics: Array<{ topic: string; numPartitions?: number; replicationFactor?: number }>,
  ): Promise<void> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const existingTopics = await admin.listTopics();
      const topicsToCreate = topics.filter((t) => !existingTopics.includes(t.topic));

      if (topicsToCreate.length > 0) {
        await admin.createTopics({
          topics: topicsToCreate.map((t) => ({
            topic: t.topic,
            numPartitions: t.numPartitions || 1,
            replicationFactor: t.replicationFactor || 1,
          })),
        });

        this.logger.log(`Created topics: ${topicsToCreate.map((t) => t.topic).join(', ')}`, KafkaService.name);
      } else {
        this.logger.log('All topics already exist', KafkaService.name);
      }

      await admin.disconnect();
    } catch (error) {
      this.logger.error('Failed to create topics:', error);
      throw error;
    }
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(groupId: string): unknown {
    return this.consumers.get(groupId);
  }
}
