import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers() {
    return this.usersRepository.findAll()
  }
}
