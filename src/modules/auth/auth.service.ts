import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../users/users.repository'

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async login(email: string, password: string) {
    const currentUser =
      await this.usersRepository.findByEmailWithPassword(email)
  }
}
