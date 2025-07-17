import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskDescription extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
