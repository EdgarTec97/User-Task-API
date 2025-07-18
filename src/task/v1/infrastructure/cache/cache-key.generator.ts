export class CacheKeyGenerator {
  private static readonly TASK_ANALYTICS_PREFIX = 'task:analytics';

  static generateTaskAnalyticsKey(startDate?: string, endDate?: string, granularity?: string): string {
    const parts = [this.TASK_ANALYTICS_PREFIX];

    if (startDate) parts.push(`start:${startDate}`);

    if (endDate) parts.push(`end:${endDate}`);

    if (granularity) parts.push(`granularity:${granularity}`);

    return parts.join(':');
  }

  static getTaskAnalyticsPattern(): string {
    return `${this.TASK_ANALYTICS_PREFIX}:*`;
  }
}
