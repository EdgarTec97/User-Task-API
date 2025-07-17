import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class AccessToken extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    const value: string = this.valueOf();
    return typeof value === 'string' && value.length > 0;
  }
}
