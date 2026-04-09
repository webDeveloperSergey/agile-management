import { JwtPayload } from 'src/shared/types/jwt-payload.interface'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
