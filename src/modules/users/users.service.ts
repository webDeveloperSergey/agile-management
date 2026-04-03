import { BadRequestException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { ALREADY_REGISTERED } from './constants/users-messages.constants'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers() {
    return this.usersRepository.findAll()
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findByEmail(email)
  }

  async createUser(userData: CreateUserDto) {
    const { email, password } = userData

    const currentUser = await this.getUserByEmail(email)
    if (currentUser) throw new BadRequestException(ALREADY_REGISTERED)

    const hashPwd = await hash(password)

    const newUser = await this.usersRepository.create(email, hashPwd)

    return newUser
  }
}
