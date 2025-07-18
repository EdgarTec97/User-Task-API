import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UserPassword extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    return true;
  }
}
