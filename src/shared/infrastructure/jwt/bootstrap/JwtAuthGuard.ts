import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { Request } from 'express';
import { IJwtService, JWT_SERVICE_TOKEN } from '@/shared/domain/jwt/JwtService';
import { Role } from '@/shared/domain/jwt/Role';
import { AccessToken } from '@/shared/domain/tokens/AccessToken';
import { AllowedRolesGuard } from '@/shared/infrastructure/jwt/bootstrap/AllowedRoles';
import type { JwtPayload } from '@/shared/domain/jwt/JwtPayload';

@Injectable()
class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JWT_SERVICE_TOKEN) private readonly jwtService: IJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request & { jwtPayload: JwtPayload } = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) throw new UnauthorizedException('Missing authorization header');

    const matches = authorizationHeader.match(/Bearer (.+)/);

    if (!matches) throw new UnauthorizedException('Malformed authorization header');

    const accessToken = new AccessToken(matches[1]);

    await this.jwtService.verify(accessToken);

    const jwtPayload = this.jwtService.decode(accessToken);

    request.jwtPayload = jwtPayload;

    return true;
  }
}

export enum DocumentationRoles {
  MEMBER_JWT = 'member-jwt',
  ADMIN_JWT = 'admin-jwt',
  REFRESH_TOKEN = 'refresh-token',
}

const roleToDocumentationRole: { [key in Role]: DocumentationRoles } = {
  [Role.ADMIN]: DocumentationRoles.ADMIN_JWT,
  [Role.MEMBER]: DocumentationRoles.MEMBER_JWT,
  [Role.REFRESH_TOKEN]: DocumentationRoles.REFRESH_TOKEN,
};

export function GuardWithJwt(
  roles: Role[],
): <TFunction, Y>(
  target: TFunction | object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void {
  const apiSecurities: (ClassDecorator & MethodDecorator)[] = roles.map(
    (role) => ApiSecurity(roleToDocumentationRole[role]) as ClassDecorator & MethodDecorator,
  );

  return applyDecorators(
    ApiBearerAuth('access-token') as ClassDecorator & MethodDecorator,
    UseGuards(JwtAuthGuard),
    SetMetadata('roles', roles),
    UseGuards(AllowedRolesGuard),
    ...apiSecurities,
  );
}
