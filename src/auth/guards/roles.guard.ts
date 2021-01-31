import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/database/enums/user.enum';
import { ROLES_KEY } from 'src/decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
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

    //adding admin to roles so admin can access all
    requiredRoles.push(Role.ADMIN);

    const { payload } = context.switchToHttp().getRequest().user;

    if (!requiredRoles.some((role) => payload.role?.includes(role))) {
      this.logger.error(`Unauthorized`);
      throw new UnauthorizedException();
    }
    return true;
  }
}
