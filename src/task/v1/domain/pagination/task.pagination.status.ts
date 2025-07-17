import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';
import { TaskStatusEnum } from '@/task/v1/domain/task/task.status';

export class TaskPaginationStatus extends SingleValueObject<TaskStatusEnum> {
  constructor(value: TaskStatusEnum) {
    super(value);
  }

  validate(): boolean {
    return true;
  }
}
