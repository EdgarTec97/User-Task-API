/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from '@/shared/infrastructure/broker/kafka.service';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';
import { Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { BROKER_CONFIG_TOKEN } from '@/shared/domain/broker/config.service';

// Mock kafkajs
jest.mock('kafkajs', () => {
  const mockProducer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    send: jest.fn(),
  };

  const mockConsumer = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
  };

  const mockAdmin = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    listTopics: jest.fn(),
    createTopics: jest.fn(),
  };

  const mockKafka = {
    producer: jest.fn(() => mockProducer),
    consumer: jest.fn(() => mockConsumer),
    admin: jest.fn(() => mockAdmin),
  };

  return {
    Kafka: jest.fn(() => mockKafka),
    // Export mock types if needed for type checking in tests
    Producer: jest.fn(),
    Consumer: jest.fn(),
  };
});

describe('KafkaService', () => {
  let service: KafkaService;
  let mockKafkaConfigService: KafkaConfigService;
  let mockLogger: Logger;
  let mockProducer: jest.Mocked<Producer>;
  let mockConsumer: jest.Mocked<Consumer>;
  let mockAdmin: any;

  beforeEach(async () => {
    // Reset mocks before each test
    (Kafka as jest.Mock).mockClear();
    mockProducer = new Kafka({} as any).producer({} as any) as unknown as jest.Mocked<Producer>;
    mockConsumer = new Kafka({} as any).consumer({} as any) as unknown as jest.Mocked<Consumer>;
    mockAdmin = new Kafka({} as any).admin();

    mockKafkaConfigService = {
      getBrokerConfig: jest.fn(() => ({ clientId: 'test-client', brokers: ['localhost:9092'] })),
      getProducerConfig: jest.fn(() => ({})),
      getConsumerConfig: jest.fn(() => ({ groupId: 'test-group' })),
    } as any;

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        {
          provide: BROKER_CONFIG_TOKEN,
          useValue: mockKafkaConfigService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect the producer', async () => {
      await service.onModuleInit();
      expect(mockProducer.connect).toHaveBeenCalledTimes(1);
      expect(mockLogger.log).toHaveBeenCalledWith('Kafka producer connected successfully', KafkaService.name);
    });

    it('should log an error if producer connection fails', async () => {
      const error = new Error('Connection failed');
      mockProducer.connect.mockRejectedValueOnce(error);

      await expect(service.onModuleInit()).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith('Failed to connect Kafka producer:', error);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect the producer and all consumers', async () => {
      // Simulate a consumer being added
      (service as any).consumers.set('test-group-1', mockConsumer);
      (service as any).consumers.set('test-group-2', mockConsumer);

      await service.onModuleDestroy();

      expect(mockProducer.disconnect).toHaveBeenCalledTimes(1);
      expect(mockConsumer.disconnect).toHaveBeenCalledTimes(2);
      expect(mockLogger.log).toHaveBeenCalledWith('Kafka connections closed', KafkaService.name);
    });

    it('should log an error if disconnection fails', async () => {
      const error = new Error('Disconnection failed');
      mockProducer.disconnect.mockRejectedValueOnce(error);

      await service.onModuleDestroy();

      expect(mockLogger.error).toHaveBeenCalledWith('Error closing Kafka connections:', error);
    });
  });

  describe('publish', () => {
    it('should send a message to the specified topic', async () => {
      const message = {
        topic: 'test-topic',
        key: 'test-key',
        value: 'test-value',
        headers: { 'x-custom': 'header' },
        partition: 0,
        errorCode: 0,
      };
      mockProducer.send.mockResolvedValueOnce([
        { topicName: 'test-topic', baseOffset: '0', logStartOffset: '0', partition: 0, errorCode: 0 },
      ]);

      await service.publish(message);

      expect(mockProducer.send).toHaveBeenCalledWith({
        topic: message.topic,
        messages: [
          {
            key: message.key,
            value: message.value,
            headers: message.headers,
            partition: message.partition,
            timestamp: expect.any(String),
          },
        ],
      });
      expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('should throw an error if message publishing fails', async () => {
      const message = {
        topic: 'test-topic',
        key: 'test-key',
        value: 'test-value',
      };
      const error = new Error('Publish failed');
      mockProducer.send.mockRejectedValueOnce(error);

      await expect(service.publish(message)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith(`Failed to publish message to topic ${message.topic}:`, error);
    });
  });

  describe('subscribe', () => {
    const mockMessageHandler = jest.fn();

    it('should subscribe to a topic and run the consumer', async () => {
      const options = { topic: 'subscribe-topic', groupId: 'subscribe-group' };

      await service.subscribe(options, mockMessageHandler);

      expect(mockConsumer.connect).toHaveBeenCalledTimes(1);
      expect(mockConsumer.subscribe).toHaveBeenCalledWith({ topic: options.topic, fromBeginning: false });
      expect(mockConsumer.run).toHaveBeenCalledWith(
        expect.objectContaining({
          eachMessage: expect.any(Function),
        }),
      );
      expect(mockLogger.log).toHaveBeenCalledWith(
        `Kafka consumer for group ${options.groupId} subscribed to topic ${options.topic}`,
        KafkaService.name,
      );
    });

    it('should not subscribe if consumer for group already exists', async () => {
      const options = { topic: 'subscribe-topic', groupId: 'existing-group' };
      (service as any).consumers.set(options.groupId, mockConsumer); // Simulate existing consumer

      await service.subscribe(options, mockMessageHandler);

      expect(mockAdmin.connect).toHaveBeenCalledTimes(0);
      expect(mockConsumer.subscribe).toHaveBeenCalledTimes(1);
      expect(mockConsumer.run).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        `Consumer for group ${options.groupId} already exists`,
        KafkaService.name,
      );
    });

    it('should handle message processing with the provided handler', async () => {
      const options = { topic: 'subscribe-topic', groupId: 'process-group' };
      const payload: EachMessagePayload = {
        topic: 'subscribe-topic',
        partition: 0,
        message: { value: Buffer.from('test message') } as any,
        heartbeat: jest.fn(),
        pause: jest.fn(),
      };

      mockConsumer.run.mockImplementationOnce(async (config) => {
        await config?.eachMessage?.(payload);
      });

      await service.subscribe(options, mockMessageHandler);

      expect(mockMessageHandler).toHaveBeenCalledWith(payload);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        `Received message from topic ${options.topic}, partition ${payload.partition}`,
        KafkaService.name,
      );
    });

    it('should log error if message handler fails', async () => {
      const options = { topic: 'subscribe-topic', groupId: 'error-group' };
      const payload: EachMessagePayload = {
        topic: 'subscribe-topic',
        partition: 0,
        message: { value: Buffer.from('test message') } as any,
        heartbeat: jest.fn(),
        pause: jest.fn(),
      };
      const error = new Error('Handler failed');
      mockMessageHandler.mockRejectedValueOnce(error);

      mockConsumer.run.mockImplementationOnce(async (config) => {
        await config?.eachMessage?.(payload);
      });

      await service.subscribe(options, mockMessageHandler);

      expect(mockMessageHandler).toHaveBeenCalledWith(payload);
      expect(mockLogger.error).toHaveBeenCalledWith(`Error processing message from topic ${options.topic}:`, error);
    });

    it('should throw an error if subscription fails', async () => {
      const options = { topic: 'subscribe-topic', groupId: 'fail-group' };
      const error = new Error('Subscription failed');
      mockConsumer.connect.mockRejectedValueOnce(error);

      await expect(service.subscribe(options, mockMessageHandler)).rejects.toThrow(error);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to subscribe to topic ${options.topic} with group ${options.groupId}:`,
        error,
      );
    });
  });

  describe('createTopics', () => {
    it('should create new topics if they do not exist', async () => {
      const topicsToCreate = [{ topic: 'new-topic-1' }, { topic: 'new-topic-2', numPartitions: 3 }];
      mockAdmin.listTopics.mockResolvedValueOnce(['existing-topic']);
      mockAdmin.createTopics.mockResolvedValueOnce(true);

      await service.createTopics(topicsToCreate);

      expect(mockAdmin.connect).toHaveBeenCalledTimes(1);
      expect(mockAdmin.listTopics).toHaveBeenCalledTimes(1);
      expect(mockAdmin.createTopics).toHaveBeenCalledWith({
        topics: [
          { topic: 'new-topic-1', numPartitions: 1, replicationFactor: 1 },
          { topic: 'new-topic-2', numPartitions: 3, replicationFactor: 1 },
        ],
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Created topics: new-topic-1, new-topic-2', KafkaService.name);
      expect(mockAdmin.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should not create topics if they already exist', async () => {
      const topicsToCreate = [{ topic: 'existing-topic-1' }];
      mockAdmin.listTopics.mockResolvedValueOnce(['existing-topic-1', 'another-existing-topic']);

      await service.createTopics(topicsToCreate);

      expect(mockAdmin.connect).toHaveBeenCalledTimes(2);
      expect(mockAdmin.listTopics).toHaveBeenCalledTimes(2);
      expect(mockAdmin.createTopics).toHaveBeenCalledTimes(1);
      expect(mockLogger.log).toHaveBeenCalledWith('All topics already exist', KafkaService.name);
      expect(mockAdmin.disconnect).toHaveBeenCalledTimes(2);
    });

    it('should log an error if topic creation fails', async () => {
      const topicsToCreate = [{ topic: 'failing-topic' }];
      const error = new Error('Topic creation failed');
      mockAdmin.listTopics.mockResolvedValueOnce([]);
      mockAdmin.createTopics.mockRejectedValueOnce(error);

      await service.createTopics(topicsToCreate).catch(() => {});

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to create topics:', error);
      expect(mockAdmin.disconnect).toHaveBeenCalledTimes(2);
    });
  });

  describe('getProducer', () => {
    it('should return the producer instance', () => {
      const producer = service.getProducer();
      expect(producer).toBe(mockProducer);
    });
  });

  describe('getConsumer', () => {
    it('should return the consumer instance for a given group ID', async () => {
      const options = { topic: 'test-topic', groupId: 'get-consumer-group' };
      await service.subscribe(options, jest.fn()); // Subscribe to create a consumer

      const consumer = service.getConsumer(options.groupId);
      expect(consumer).toBe(mockConsumer);
    });

    it('should return undefined if consumer does not exist for group ID', () => {
      const consumer = service.getConsumer('non-existent-group');
      expect(consumer).toBeUndefined();
    });
  });
});
