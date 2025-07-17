import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskAnalyticsActiveTasks extends SingleValueObject<number> {
  constructor(value: number) {
    super(value);
  }

  validate(): boolean {
    return this.valueOf() >= 0;
  }
}
