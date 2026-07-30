import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

// Extend Express Request type to include 'user'
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      roles?: string[];
      // add other properties if needed
    };
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (
      !user ||
      !user.roles ||
      !requiredRoles.some((r) => user.roles!.includes(r))
    ) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
