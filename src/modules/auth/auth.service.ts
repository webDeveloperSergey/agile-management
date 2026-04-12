import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { CookieOptions, Response } from 'express'
import { isDevMode } from 'src/shared/utils/is-dev-mode.util'
import { UsersService } from './../users/users.service'
import { INVALID_CREDENTIALS } from './constants/auth-messages.constants'
import { SignInDto } from './dto/sign-in.dto'
import {
  ENV_REFRESH_EXPIRES,
  REFRESH_TOKEN_NAME,
} from './constants/auth-token.constants'
import type { JwtRefreshPayload } from 'src/shared/types/jwt-payload.interface'
import {
  USER_SELECT_WITH_PASSWORD,
  USER_SELECT_WITH_REFRESH_TOKEN,
} from 'src/shared/constants/users-select.constants'
import type { User } from 'prisma/generated/prisma/client'

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

  async signIn(signInDto: SignInDto) {
    const validatedUser = await this.validateUser(signInDto)

    const tokens = this.generateTokens(
      validatedUser.user_id,
      validatedUser.email,
    )

    // Записываем в БД хеш refresh токена
    const { access_token, refresh_token } = tokens
    await this.setHashToken(validatedUser, refresh_token)

    return {
      user: validatedUser,
      refresh_token,
      access_token,
    }
  }

  async refresh(token: string) {
    const currentUserId = await this.extractUserIdFromRefreshToken(token)
    const currentUser = await this.usersService.getOneUser(
      currentUserId,
      USER_SELECT_WITH_REFRESH_TOKEN,
    )

    if (!currentUser.refresh_token) throw new UnauthorizedException()

    const isValidToken = await verify(currentUser.refresh_token, token)

    if (!isValidToken) throw new UnauthorizedException()

    const { access_token, refresh_token } = this.generateTokens(
      currentUser.user_id,
      currentUser.email,
    )

    await this.setHashToken(currentUser, refresh_token)

    return {
      refresh_token,
      access_token,
    }
  }

  // Private helpers ========
  private async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto

    const currentUser = await this.usersService.getUserByEmail(
      email,
      USER_SELECT_WITH_PASSWORD,
    )
    if (!currentUser) throw new UnauthorizedException(INVALID_CREDENTIALS)

    const isPasswordValid = await verify(currentUser.password, password)
    if (!isPasswordValid) throw new UnauthorizedException(INVALID_CREDENTIALS)

    const { password: _, ...userWithoutPassword } = currentUser

    return userWithoutPassword
  }

  private generateTokens(user_id: string, email: string) {
    const payload = { sub: user_id, email }

    const access_token = this.jwtService.sign(payload)
    const refresh_token = this.jwtService.sign(
      { id: user_id },
      {
        expiresIn: `${this.configService.get(ENV_REFRESH_EXPIRES)}d`,
      },
    )

    return { access_token, refresh_token }
  }

  private async extractUserIdFromRefreshToken(token: string) {
    let userId = ''

    try {
      const payload: JwtRefreshPayload =
        await this.jwtService.verifyAsync(token)

      userId = payload.id
    } catch {
      throw new UnauthorizedException()
    }

    return userId
  }

  private async setHashToken(user: Omit<User, 'password'>, token: string) {
    const hashedRefreshToken = await hash(token)
    await this.usersService.updateRefreshToken(user.user_id, hashedRefreshToken)
  }
  // ./ Private helpers ========

  // Work with Cookies ========
  addRefreshTokenToCookie(res: Response, refreshToken: string) {
    const expiresIn = new Date()
    expiresIn.setDate(
      expiresIn.getDate() +
        parseInt(this.configService.get(ENV_REFRESH_EXPIRES) || '7'),
    )

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
      ...this.cookieOptions,
      expires: expiresIn,
    })
  }

  clearRefreshTokenCookie(res: Response) {
    res.cookie(REFRESH_TOKEN_NAME, '', {
      ...this.cookieOptions,
      expires: new Date(0),
    })
  }
}
// ./ Work with Cookies ========
