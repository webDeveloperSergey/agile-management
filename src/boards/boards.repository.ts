import { Injectable } from '@nestjs/common'
import type { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
