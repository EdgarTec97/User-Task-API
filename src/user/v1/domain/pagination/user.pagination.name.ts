import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UserPaginationName extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    return true;
  }
}
