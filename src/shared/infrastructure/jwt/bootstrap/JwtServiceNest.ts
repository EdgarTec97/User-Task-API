import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UUID } from '@/shared/domain/ddd/UUID';
import { JwtPayload } from '@/shared/domain/jwt/JwtPayload';
import { IJwtService } from '@/shared/domain/jwt/JwtService';
import { Role } from '@/shared/domain/jwt/Role';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';

export class JwtServiceNest implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  private createRefreshToken(refreshToken: AccessToken): AccessToken {
    const { role, sub } = this.jwtService.decode<JwtPayload>(refreshToken.getValue());

    const jwt: string = this.jwtService.sign(
      { accessTokenRole: role, role: Role.REFRESH_TOKEN, sub },
      {
        expiresIn: '30d',
      },
    );

    return new AccessToken(jwt);
  }

  public sign(uuid: UUID, role: Role): AccessToken {
    const payload = {
      role,
      sub: uuid.getValue(),
    };
    const jwt: string = this.jwtService.sign(payload);

    return new AccessToken(jwt);
  }

  async verify(jwt: AccessToken): Promise<boolean> {
    const response: Promise<boolean> = this.jwtService
      .verifyAsync(jwt.getValue(), {
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
    const response: JwtPayload = this.jwtService.decode<JwtPayload>(jwt.getValue());
    return response;
  }
}
