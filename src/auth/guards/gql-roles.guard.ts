import {
  Injectable,
  CanActivate,
  Logger,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../database/enums/user.enum';
import { ROLES_KEY } from '../../decorators/role.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuardGql implements CanActivate {
  private logger = new Logger('Roles');
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { payload } = ctx.getContext().req.user;

    if (!requiredRoles.some((role) => payload.role?.includes(role))) {
      this.logger.error(`Unauthorized`);
      throw new UnauthorizedException();
    }
    return true;
  }
}
