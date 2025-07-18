import { ValueObject } from '@/shared/domain/ddd/ValueObject';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';
import { ExpirationTime } from '@/shared/domain/tokens/ExpirationTime';

export class TokenPair extends ValueObject {
  constructor(
    private readonly accessToken: AccessToken,
    private readonly refreshToken: AccessToken,
    private expirationTime: ExpirationTime,
  ) {
    super();
  }

  static fromPrimitives({
    accessToken,
    expirationTime,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
    expirationTime: string;
  }): TokenPair {
    return new TokenPair(
      new AccessToken(accessToken),
      new AccessToken(expirationTime),
      new ExpirationTime(refreshToken),
    );
  }

  toPrimitives() {
    return {
      accessToken: this.accessToken.valueOf(),
      refreshToken: this.refreshToken.valueOf(),
      expirationTime: this.expirationTime.valueOf(),
    };
  }
}
