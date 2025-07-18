import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskPaginationAssignedUserName extends SingleValueObject<string | undefined> {
  constructor(value?: string) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
