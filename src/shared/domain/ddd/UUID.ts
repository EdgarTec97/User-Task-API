import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UUID extends SingleValueObject<string> {
  constructor(uuid: string) {
    super(uuid);
  }

  equals(uuid: UUID): boolean {
    return this.getValue() === uuid.getValue();
  }
}
