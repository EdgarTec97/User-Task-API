import { SingleValueObject } from '@/shared/domain/ddd/SingleValueObject';

export class ResetPasswordRequestToken extends SingleValueObject<string> {
  validate(): boolean {
    const value: string = this.valueOf();
    return typeof value === 'string' && value.length > 0;
  }
}
