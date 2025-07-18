import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskTitle extends SingleValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
