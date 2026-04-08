import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { UsersService } from './../users/users.service'
import { INVALID_CREDENTIALS } from './constants/auth-messages.constants'
import { SignInDto } from './dto/sign-in.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto

    const currentUser =
      await this.usersService.getUserByEmailWithPassword(email)
    if (!currentUser) throw new UnauthorizedException(INVALID_CREDENTIALS)

    const isPasswordValid = await verify(currentUser.password, password)
    if (!isPasswordValid) throw new UnauthorizedException(INVALID_CREDENTIALS)

    const payload = { sub: currentUser.user_id, email: currentUser.email }

    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
