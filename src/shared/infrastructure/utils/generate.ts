import { v4 } from 'uuid';

export class Generate {
  static uuid(): string {
    return v4() as string;
  }
  static currentDate(): string {
    return new Date().toISOString();
  }
}
