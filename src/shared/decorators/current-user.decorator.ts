import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (data: unknown, req: ExecutionContext) => {
    const request: Request = req.switchToHttp().getRequest()
    return request.user
  },
)
