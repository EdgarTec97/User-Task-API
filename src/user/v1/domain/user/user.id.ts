import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { validateUUID } from '@/shared/domain/utils/validators';

export class UserId extends SingleValueObject<string> {
  constructor(uuid: string) {
    super(uuid);
  }

  validate(): boolean {
    return validateUUID(this.valueOf());
  }
}
