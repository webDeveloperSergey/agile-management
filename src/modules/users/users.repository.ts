import { Injectable } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { USER_SELECT } from 'src/shared/constants/users-select.constants'

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

  async findByEmail<CustomSelect extends Prisma.UserSelect>(
    email: string,
    select?: CustomSelect,
  ) {
    return this.prisma.user.findUnique({
      where: { email },
      select,
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

  async updateRefreshToken(user_id: string, refresh_token: string) {
    return this.prisma.user.update({
      where: { user_id },
      data: { refresh_token },
      select: USER_SELECT,
    })
  }
}
