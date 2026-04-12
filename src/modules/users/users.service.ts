import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { hash } from 'argon2'
import {
  ALREADY_REGISTERED,
  NOT_FOUND_BY_ID,
} from './constants/users-messages.constants'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getOneUser<CustomSelect extends Prisma.UserSelect>(
    id: string,
    select?: CustomSelect,
  ) {
    const currentUser = await this.usersRepository.findById(id, select)

    if (!currentUser) throw new NotFoundException(NOT_FOUND_BY_ID)

    return currentUser
  }

  async getAllUsers() {
    return this.usersRepository.findAll()
  }

  async getUserByEmail<CustomSelect extends Prisma.UserSelect>(
    email: string,
    select?: CustomSelect,
  ) {
    return this.usersRepository.findByEmail(email, select)
  }

  async createUser(userData: CreateUserDto) {
    const { email, password } = userData

    const currentUser = await this.getUserByEmail(email, undefined)
    if (currentUser) throw new BadRequestException(ALREADY_REGISTERED)

    const hashPwd = await hash(password)

    const newUser = await this.usersRepository.create(email, hashPwd)

    return newUser
  }

  async updateRefreshToken(user_id: string, refresh_token: string) {
    return this.usersRepository.updateRefreshToken(user_id, refresh_token)
  }
}
