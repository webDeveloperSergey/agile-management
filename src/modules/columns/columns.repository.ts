import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class ColumnsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getColumnsByBoardId(boardId: string) {
    return await this.prisma.column.findMany({
      where: { board_id: boardId },
    })
  }
}
