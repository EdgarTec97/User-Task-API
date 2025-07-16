import { DomainId } from '@/shared/domain/events/DomainId';

class DomainEventId extends DomainId {}

export abstract class DomainEvent {
  private id: DomainEventId;

  constructor(uuid: string) {
    this.id = new DomainEventId(uuid);
  }

  toPrimitives(): { id: string } {
    return { id: this.id.valueOf() };
  }
}
