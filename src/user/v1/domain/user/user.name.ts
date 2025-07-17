import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UserName extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    const length: number = this.valueOf().length;
    return length > 0 && length <= 100;
  }
}
