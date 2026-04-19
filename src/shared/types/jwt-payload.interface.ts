import { UserRole } from 'prisma/generated/prisma/client'

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
}

export interface JwtRefreshPayload {
  id: string
}
