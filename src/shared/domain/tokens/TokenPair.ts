import { ValueObject } from '@/shared/domain/ddd/ValueObject';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';
import { ExpirationTime } from '@/shared/domain/tokens/ExpirationTime';

export class TokenPair extends ValueObject {
  constructor(
    private readonly accessToken: AccessToken,
    private readonly refrestToken: AccessToken,
    private expirationTime: ExpirationTime,
  ) {
    super();
  }

  toPrimitives() {
    return {
      accessToken: this.accessToken.valueOf(),
      refreshToken: this.refrestToken.valueOf(),
      expirationTime: this.expirationTime.valueOf(),
    };
  }
}
