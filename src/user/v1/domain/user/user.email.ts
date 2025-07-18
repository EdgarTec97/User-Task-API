import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { validateEmail } from '@/shared/domain/utils/validators';

export class UserEmail extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    return validateEmail(this.valueOf());
  }
}
