import { UUID } from '@/shared/domain/ddd/UUID';

export class DomainId extends UUID {
  toPrimitives(): string {
    return this.valueOf();
  }
}
