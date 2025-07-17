import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export enum TaskAnalyticsGranularityEnum {
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export class TaskAnalyticsGranularity extends SingleValueObject<TaskAnalyticsGranularityEnum> {
  constructor(value: TaskAnalyticsGranularityEnum) {
    super(value);
  }

  validate(): boolean {
    return [
      TaskAnalyticsGranularityEnum.HOUR,
      TaskAnalyticsGranularityEnum.DAY,
      TaskAnalyticsGranularityEnum.MONTH,
      TaskAnalyticsGranularityEnum.YEAR,
    ].includes(this.valueOf());
  }
}
