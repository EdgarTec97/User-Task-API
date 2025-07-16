import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithJwtPayload } from '@/shared/domain/jwt/JwtPayload';
import { Role } from '@/shared/domain/tokens/Role';

@Injectable()
export class AllowedRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: Role[] = this.reflector.get<Role[]>('roles', context.getHandler());

    const req: RequestWithJwtPayload = context.switchToHttp().getRequest();

    return roles.includes(req.jwtPayload.role);
  }
}
