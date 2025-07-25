import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskAnalyticsAverageCostPerCompletedTask extends SingleValueObject<number> {
  constructor(value: number) {
    super(value);
  }

  validate(): boolean {
    return this.valueOf() >= 0;
  }
}
