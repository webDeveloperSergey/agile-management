import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { COLUMN_SELECT } from './constants/selects.constants'

@Injectable()
export class ColumnsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getColumnsByBoardId(boardId: string) {
    return await this.prisma.column.findMany({
      where: { board_id: boardId },
      orderBy: { order: 'asc' },
      select: COLUMN_SELECT,
    })
  }

  async getColumn(columnId: string) {
    return await this.prisma.column.findUnique({
      where: { column_id: columnId },
      select: COLUMN_SELECT,
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

  async updateColumn(boardId: string, columnId: string, name: string) {
    return await this.prisma.column.updateMany({
      where: {
        board_id: boardId,
        column_id: columnId,
      },
      data: { name },
    })
  }

  async deleteColumn(boardId: string, columnId: string) {
    return await this.prisma.column.deleteMany({
      where: {
        board_id: boardId,
        column_id: columnId,
      },
    })
  }
}
