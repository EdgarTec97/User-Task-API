import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class ExpirationTime extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    return Boolean(this.valueOf() && this.valueOf().length > 0);
  }
}
