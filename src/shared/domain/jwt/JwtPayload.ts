import { Role } from '@/shared/domain/jwt/Role';

export type JwtPayload = {
  iat: number;
  exp: number;
  sub: string;
  role: Role;
  email: string;
  name: string;
  id: string;
  accessTokenRole?: Role;
};

export type JwtPayloadForRefreshToken = JwtPayload & { accessTokenRole: Role };

export type RequestWithJwt<T> = { jwtPayload: T };

export type RequestWithJwtPayload = RequestWithJwt<JwtPayload>;
