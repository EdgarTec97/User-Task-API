import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UserUpdatedAt extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    const parsedDate = Date.parse(this.valueOf());
    return !isNaN(parsedDate);
  }
}
