import { ValueObject } from '@/shared/domain/ddd/ValueObject';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';

export class TokenPair extends ValueObject {
  constructor(
    private readonly accessToken: AccessToken,
    private readonly refrestToken: AccessToken,
  ) {
    super();
  }

  toPrimitives() {
    return {
      accessToken: this.accessToken.valueOf(),
      refreshToken: this.refrestToken.valueOf(),
    };
  }
}
