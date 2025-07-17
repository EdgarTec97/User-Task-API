import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { validateUUID } from '@/shared/domain/utils/validators';

export class TaskId extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    return validateUUID(this.valueOf());
  }
}
