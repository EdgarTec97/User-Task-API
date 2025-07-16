import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class Role extends SingleValueObject<string> {
  constructor(role: string) {
    super(role);
  }
}
