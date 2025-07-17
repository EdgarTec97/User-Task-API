import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UUID } from '@/shared/domain/ddd/UUID';
import { JwtPayload } from '@/shared/domain/jwt/JwtPayload';
import { IJwtService } from '@/shared/domain/jwt/JwtService';
import { Role } from '@/shared/domain/jwt/Role';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';
import { TokenPair } from '@/shared/domain/tokens/TokenPair';
import { ExpirationTime } from '@/shared/domain/tokens/ExpirationTime';
import { GeneralUtils } from '@/shared/infrastructure/utils/generate';

@Injectable()
export class JwtServiceNest implements IJwtService {
  private expirationTime: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.expirationTime = this.config.get<string>('JWT_EXPIRATION_TIME') || '1h';
  }

  private createRefreshToken(refreshToken: AccessToken): AccessToken {
    const { role, sub, ...custom } = this.jwtService.decode<JwtPayload>(refreshToken.valueOf());

    const jwt: string = this.jwtService.sign(
      GeneralUtils.omit(
        {
          ...custom,
          accessTokenRole: role,
          role: Role.REFRESH_TOKEN,
          sub,
        },
        ['iat', 'exp'],
      ),
    );

    return new AccessToken(jwt);
  }

  private createToken(uuid: UUID, role: Role, custom?: object): AccessToken {
    const payload = {
      ...custom,
      role,
      sub: uuid.valueOf(),
    };
    const jwt: string = this.jwtService.sign(payload);

    return new AccessToken(jwt);
  }

  public sign(uuid: UUID, role: Role, custom?: object): TokenPair {
    const accessToken: AccessToken = this.createToken(uuid, role, custom);
    const refreshToken: AccessToken = this.createRefreshToken(accessToken);

    return new TokenPair(accessToken, refreshToken, new ExpirationTime(this.expirationTime));
  }

  async verify(jwt: AccessToken): Promise<boolean> {
    const response: Promise<boolean> = this.jwtService
      .verifyAsync(jwt.valueOf(), {
        ignoreExpiration: false,
      })
      .then(() => true)
      .catch((error) => {
        const code = error.message.replace(' ', '_').toUpperCase();
        const description = code === 'JWT_EXPIRED' ? `Expired at ${error.expiredAt.toISOString()}` : '';

        throw new UnauthorizedException(code, description);
      });

    return response;
  }

  public decode(jwt: AccessToken): JwtPayload {
    const response: JwtPayload = this.jwtService.decode<JwtPayload>(jwt.valueOf());
    return response;
  }
}
