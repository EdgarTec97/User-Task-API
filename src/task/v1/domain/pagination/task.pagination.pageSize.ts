import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class TaskPaginationPageSize extends SingleValueObject<number> {
  constructor(name: number) {
    super(name);
  }

  validate(): boolean {
    return true;
  }
}
