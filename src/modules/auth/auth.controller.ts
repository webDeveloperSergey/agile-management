import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/sign-in.dto'
import { Cookies } from 'src/shared/decorators/cookies.decorator'
import { REFRESH_TOKEN_NAME } from './constants/auth-token.constants'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...response } =
      await this.authService.signIn(signInDto)

    this.authService.addRefreshTokenToCookie(res, refresh_token)

    return response
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Cookies(REFRESH_TOKEN_NAME) refreshToken: string) {
    await this.authService.refresh(refreshToken)
  }
}
