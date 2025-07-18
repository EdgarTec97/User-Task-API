import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UserPaginationEmail extends SingleValueObject<string> {
  constructor(name: string) {
    super(name);
  }

  validate(): boolean {
    return true;
  }
}
