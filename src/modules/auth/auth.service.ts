import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
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

  REFRESH_TOKEN_NAME = 'refresh_token'

  async signIn(signInDto: SignInDto) {
    const validatedUser = await this.validateUser(signInDto)

    const tokens = this.generateTokens(
      validatedUser.user_id,
      validatedUser.email,
    )

    const { access_token, refresh_token } = tokens
    const hashedRefreshToken = await hash(refresh_token)

    await this.usersService.updateRefreshToken(
      validatedUser.user_id,
      hashedRefreshToken,
    )

    return {
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
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    )

    return { access_token, refresh_token }
  }
}
