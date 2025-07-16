import { randomUUID } from 'crypto';

export class GenerateUUID {
  static generate(): string {
    return randomUUID();
  }
}
