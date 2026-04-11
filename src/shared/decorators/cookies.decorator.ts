import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const Cookies = createParamDecorator(
  (fieldCookie: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest()
    const cookies = request.cookies

    return fieldCookie ? (cookies?.[fieldCookie] as string) : cookies
  },
)
