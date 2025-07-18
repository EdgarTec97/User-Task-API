import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskPaginationAssignedUserEmail extends SingleValueObject<string | undefined> {
  constructor(value?: string) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
