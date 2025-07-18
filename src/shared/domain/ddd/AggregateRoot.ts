import { DomainEvent } from '@/shared/domain/events/DomainEvent';

export abstract class AggregateRoot {
  private events: DomainEvent[] = [];

  record(domainEvent: DomainEvent): void {
    this.events.push(domainEvent);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  abstract toPrimitives(): Record<string, string | number | boolean | undefined | object>;
}
