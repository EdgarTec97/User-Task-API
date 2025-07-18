import { Inject, Injectable, Logger } from '@nestjs/common';
import { KafkaConfigService } from '@/shared/infrastructure/broker/kafka.config';
import { UserCreatedEvent } from '@/user/v1/domain/events/user-created.event';
import { UserCreatedEventDto } from '@/user/v1/gateway/dtos/events/user-created-event.dto';
import { BROKER_SERVICE_TOKEN, IBrokerService } from '@/shared/domain/broker/broker.service';

@Injectable()
export class UserCreatedBrokerPublisher {
  constructor(
    @Inject(BROKER_SERVICE_TOKEN)
    private readonly brokerService: IBrokerService,
    private readonly kafkaConfig: KafkaConfigService,
    private readonly logger: Logger,
  ) {}

  async publish(event: UserCreatedEvent): Promise<void> {
    try {
      const eventDto = UserCreatedEventDto.fromDomain(event);
      const topics = this.kafkaConfig.getTopics();

      await this.brokerService.publish({
        topic: topics.USER_EVENTS,
        key: event.getUserId().valueOf(),
        value: JSON.stringify(eventDto),
        headers: {
          'event-type': event.getEventName(),
          'event-version': '1.0',
          'content-type': 'application/json',
          'correlation-id': event.toPrimitives().id,
          timestamp: event.getOccurredOn().toISOString(),
        },
      });

      this.logger.log(
        `Published UserCreatedEvent for user ${event.getUserId().valueOf()}`,
        UserCreatedBrokerPublisher.name,
      );
    } catch (error) {
      this.logger.error(`Failed to publish UserCreatedEvent for user ${event.getUserId().valueOf()}:`, error);
      throw error;
    }
  }

  async publishBatch(events: UserCreatedEvent[]): Promise<void> {
    try {
      const publishPromises = events.map((event) => this.publish(event));
      await Promise.all(publishPromises);

      this.logger.log(`Published batch of ${events.length} UserCreatedEvents`, UserCreatedBrokerPublisher.name);
    } catch (error) {
      this.logger.error(`Failed to publish batch of UserCreatedEvents:`, error);
      throw error;
    }
  }
}
