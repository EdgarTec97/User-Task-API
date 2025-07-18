import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskDueDate extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
