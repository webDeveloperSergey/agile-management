import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from 'prisma/generated/prisma/client'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { Request } from 'express'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!roles) return true

    const request: Request = context.switchToHttp().getRequest()
    const user = request.user

    return roles.some((role) => user?.role === role)
  }
}
