import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskDescription extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    const value: string = this.valueOf();
    return value.length > 0 && value.length < 100;
  }
}
