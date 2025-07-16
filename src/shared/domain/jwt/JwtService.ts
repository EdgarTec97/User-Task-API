import { UUID } from '@/shared/domain/ddd/UUID';
import { JwtPayload } from '@/shared/domain/jwt/JwtPayload';
import { Role } from '@/shared/domain/jwt/Role';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';
import { TokenPair } from '@/shared/domain/tokens/TokenPair';

export const JWT_SERVICE_TOKEN: symbol = Symbol('JWT_SERVICE_TOKEN');

export interface IJwtService {
  sign(uuid: UUID, role: Role, custom?: object): TokenPair;
  verify(jwt: AccessToken): Promise<boolean>;
  decode(jwt: AccessToken): JwtPayload;
}
