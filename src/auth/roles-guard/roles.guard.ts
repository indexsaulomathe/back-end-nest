import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) {
      this.logger.log('No roles defined, allowing access by default');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      this.logger.warn('User roles are missing or invalid');
      throw new ForbiddenException('Forbidden: User roles are missing');
    }

    const hasRole = user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      this.logger.warn(
        `User ${user.email || 'unknown'} does not have the required roles: ${roles.join(
          ', ',
        )}`,
      );
      throw new ForbiddenException(
        'Forbidden: User does not have the required roles',
      );
    }

    return true;
  }
}
