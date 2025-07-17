import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UserPaginationPage extends SingleValueObject<number> {
  constructor(name: number) {
    super(name);
  }

  validate(): boolean {
    return this.valueOf() >= 1;
  }
}
