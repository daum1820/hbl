import { Injectable, CanActivate, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../commons/decorators/roles.decorator';
import { Role } from '../../commons/enum/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log(`canActivate - Checking Roles...`);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // method has not Roles restrictions, no further check is need.
    if (!requiredRoles) {
      this.logger.log(`< canActivate - ...no roles restriction was found`);
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      this.logger.warn(`< canActivate - No user was found`);
      throw new UnauthorizedException();
    }

    this.logger.log(`canActivate - Checking user ${JSON.stringify(user)} with roles ${requiredRoles}`);
    const activate = requiredRoles.some((role) => user.role == role);
    if (!activate) {
      this.logger.warn(`< canActivate - Permission denied for user ${user.username} with role ${user.role}`);
    }

    return activate;
  }
}