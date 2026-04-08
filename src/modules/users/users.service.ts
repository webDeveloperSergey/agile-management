import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
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

  async getOneUser(id: string) {
    const currentUser = await this.usersRepository.findById(id)

    if (!currentUser) throw new NotFoundException(NOT_FOUND_BY_ID)

    return currentUser
  }

  async getAllUsers() {
    return this.usersRepository.findAll()
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findByEmail(email)
  }

  async getUserByEmailWithPassword(email: string) {
    return this.usersRepository.findByEmailWithPassword(email)
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
