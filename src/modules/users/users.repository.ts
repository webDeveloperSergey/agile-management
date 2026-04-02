import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany()
  }
}
