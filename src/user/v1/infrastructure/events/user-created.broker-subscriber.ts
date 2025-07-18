import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from '@/shared/infrastructure/broker/kafka.service';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';
import { UserCreatedEventDto } from '@/user/v1/gateway/dtos/events/user-created-event.dto';
import { EachMessagePayload } from '@/shared/domain/broker/primitives';

@Injectable()
export class UserCreatedBrokerSubscriber implements OnModuleInit {
  private readonly CONSUMER_GROUP_ID: string;
  private readonly eventName: string;

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly kafkaConfig: KafkaConfigService,
    private readonly logger: Logger,
    readonly config: ConfigService,
  ) {
    this.CONSUMER_GROUP_ID = config.get<string>('KAFKA_GROUP_ID', 'KAFKA_GROUP_ID');
    this.eventName = 'user.created';
  }

  async onModuleInit(): Promise<void> {
    await this.subscribeToUserCreatedEvents();
  }

  private async subscribeToUserCreatedEvents(): Promise<void> {
    try {
      const topics: { USER_EVENTS: string } = this.kafkaConfig.getTopics();

      // Create topic if it doesn't exist
      await this.kafkaService.createTopics([
        {
          topic: topics.USER_EVENTS,
          numPartitions: 3,
          replicationFactor: 1,
        },
      ]);

      // Subscribe to the topic
      await this.kafkaService.subscribe(
        {
          topic: topics.USER_EVENTS,
          groupId: this.CONSUMER_GROUP_ID,
          fromBeginning: false,
        },
        this.handleUserCreatedEvent.bind(this) as (payload: EachMessagePayload) => Promise<void>,
      );

      this.logger.log(
        `Subscribed to ${topics.USER_EVENTS} topic with group ${this.CONSUMER_GROUP_ID}`,
        UserCreatedBrokerSubscriber.name,
      );
    } catch (error) {
      this.logger.error('Failed to subscribe to UserCreated events:', error);
      throw error;
    }
  }

  private handleUserCreatedEvent(payload: EachMessagePayload): void {
    try {
      const { message, topic, partition } = payload;

      if (!message.value) {
        this.logger.warn('Received empty message', UserCreatedBrokerSubscriber.name);
        return;
      }

      const messageValue = message.value.toString();
      const eventDto: UserCreatedEventDto = JSON.parse(messageValue);

      // Validate that this is a UserCreated event
      if (eventDto.eventName !== this.eventName) {
        this.logger.debug(`Ignoring event of type: ${eventDto.eventName}`, UserCreatedBrokerSubscriber.name);
        return;
      }

      // Log the required message
      this.logger.log('Listening User-Created Action', UserCreatedBrokerSubscriber.name);

      // Additional processing can be added here
      this.logger.debug(`Processing UserCreatedEvent for user: ${eventDto.userId}`, {
        userId: eventDto.userId,
        userName: eventDto.userName,
        userEmail: eventDto.userEmail,
        userRole: eventDto.userRole,
        occurredOn: eventDto.occurredOn,
        topic,
        partition,
        offset: message.offset,
        headers: message.headers,
      });

      // Here you could add additional business logic such as:
      // - Sending welcome emails
      // - Creating user profiles in other services
      // - Updating analytics
      // - Triggering other workflows
    } catch (error) {
      this.logger.error('Error processing UserCreatedEvent:', error);
      // In a production environment, you might want to:
      // - Send to dead letter queue
      // - Implement retry logic
      // - Alert monitoring systems
      throw error;
    }
  }

  // Method to manually process a UserCreatedEvent (useful for testing)
  public processUserCreatedEvent(eventDto: UserCreatedEventDto): void {
    this.logger.log('Listening User-Created Action', UserCreatedBrokerSubscriber.name);
    this.logger.debug(`Manually processing UserCreatedEvent for user: ${eventDto.userId}`, eventDto);
  }
}
