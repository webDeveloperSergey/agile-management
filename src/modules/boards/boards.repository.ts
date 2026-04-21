import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
