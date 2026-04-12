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
import type { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, ...response } =
      await this.authService.register(registerDto)

    this.authService.addRefreshTokenToCookie(res, refresh_token)

    return response
  }

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
  async refresh(
    @Cookies(REFRESH_TOKEN_NAME) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refresh_token, access_token } =
      await this.authService.refresh(refreshToken)

    this.authService.addRefreshTokenToCookie(res, refresh_token)

    return { access_token }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @Cookies(REFRESH_TOKEN_NAME) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(refreshToken)
    this.authService.clearRefreshTokenCookie(res)
  }
}
