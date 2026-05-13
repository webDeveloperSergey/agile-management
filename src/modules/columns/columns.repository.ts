import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { COLUMN_SELECT } from './dto/selects.constants'

@Injectable()
export class ColumnsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getColumnsByBoardId(boardId: string) {
    return await this.prisma.column.findMany({
      where: { board_id: boardId },
      orderBy: { order: 'asc' },
    })
  }

  async createColumn(boardId: string, name: string, order: number) {
    return await this.prisma.column.create({
      data: {
        board_id: boardId,
        name,
        order: ++order,
      },
      select: COLUMN_SELECT,
    })
  }
}
