import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export enum TaskStatusEnum {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export class TaskStatus extends SingleValueObject<TaskStatusEnum> {
  constructor(value: TaskStatusEnum) {
    super(value);
  }

  validate(): boolean {
    return [TaskStatusEnum.ACTIVE, TaskStatusEnum.COMPLETED].includes(this.valueOf());
  }
}
