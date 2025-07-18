import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { validateDate } from '@/shared/domain/utils/validators';

export class TaskAnalyticsEndDate extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    return validateDate(this.valueOf());
  }
}
