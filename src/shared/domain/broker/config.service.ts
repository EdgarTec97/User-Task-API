export const BROKER_CONFIG_TOKEN = Symbol.for('BROKER_CONFIG_TOKEN');

export interface IBrokerConfigService {
  getTopics(): { EVENTS: string };
}
