import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class UsertTaskCost extends SingleValueObject<number> {
  constructor(name: number) {
    super(name);
  }

  validate(): boolean {
    return this.valueOf() >= 0;
  }
}
