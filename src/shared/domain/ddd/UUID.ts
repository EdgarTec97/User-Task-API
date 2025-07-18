import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { validateUUID } from '@/shared/domain/utils/validators';

export class UUID extends SingleValueObject<string> {
  constructor(uuid: string) {
    super(uuid);
  }

  equals(uuid: UUID): boolean {
    return this.valueOf() === uuid.valueOf();
  }

  validate(): boolean {
    return validateUUID(this.valueOf());
  }
}
