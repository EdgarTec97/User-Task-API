import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskEstimationHours extends SingleValueObject<number> {
  constructor(value: number) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
