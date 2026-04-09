import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { CookieOptions, Response } from 'express'
import { isDevMode } from 'src/shared/utils/is-dev-mode.util'
import { UsersService } from './../users/users.service'
import { INVALID_CREDENTIALS } from './constants/auth-messages.constants'
import { SignInDto } from './dto/sign-in.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Делаем getter, поскольку инициализации полей класса выполнится до того, как параметры конструктора будут присвоены
  // Getter вычисляется при вызове, а не на старте (configService уже проинициализируется)
  private get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      domain: this.configService.get<string>('DOMAIN'),
      sameSite: isDevMode(this.configService) ? 'none' : 'strict',
      secure: true,
    }
  }

  REFRESH_TOKEN_NAME = 'refresh_token'

  async signIn(signInDto: SignInDto) {
    const validatedUser = await this.validateUser(signInDto)
    const userWithoutPassword = await this.usersService.getUserByEmail(
      validatedUser.email,
    )

    const tokens = this.generateTokens(
      validatedUser.user_id,
      validatedUser.email,
    )

    // Записываем в БД хеш refresh токена
    const { access_token, refresh_token } = tokens
    const hashedRefreshToken = await hash(refresh_token)

    await this.usersService.updateRefreshToken(
      validatedUser.user_id,
      hashedRefreshToken,
    )

    return {
      user: userWithoutPassword,
      refresh_token,
      access_token,
    }
  }

  private async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto

    const currentUser =
      await this.usersService.getUserByEmailWithPassword(email)
    if (!currentUser) throw new UnauthorizedException(INVALID_CREDENTIALS)

    const isPasswordValid = await verify(currentUser.password, password)
    if (!isPasswordValid) throw new UnauthorizedException(INVALID_CREDENTIALS)

    return currentUser
  }

  private generateTokens(user_id: string, email: string) {
    const payload = { sub: user_id, email }

    const access_token = this.jwtService.sign(payload)
    const refresh_token = this.jwtService.sign(
      { id: user_id },
      {
        expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRES_IN')}d`,
      },
    )

    return { access_token, refresh_token }
  }

  addRefreshTokenToCookie(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(
      expiresIn.getDate() +
        parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7'),
    )

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      ...this.cookieOptions,
      expires: expiresIn,
    })
  }

  clearRefreshTokenCookie(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      ...this.cookieOptions,
      expires: new Date(0),
    })
  }
}
