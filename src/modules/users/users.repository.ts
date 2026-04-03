import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import {
  USER_SELECT,
  USER_SELECT_WITH_PASSWORD,
} from './constants/users-select.constants'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.user.findMany({
      select: USER_SELECT,
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { user_id: id },
      select: USER_SELECT,
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: USER_SELECT,
    })
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: USER_SELECT_WITH_PASSWORD,
    })
  }

  async create(email: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
      },
      select: USER_SELECT,
    })
  }
}
