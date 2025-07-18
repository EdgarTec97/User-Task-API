import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { validateDate } from '@/shared/domain/utils/validators';

export class UserUpdatedAt extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    return validateDate(this.valueOf());
  }
}
