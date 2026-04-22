import { Injectable } from '@nestjs/common'
import { BoardRole } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { BOARD_SELECT } from './constants/selects.constants'
import { CreateBoardDto } from './dto/create-board.dto'

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBoard(boardId: string) {
    return this.prisma.board.findUnique({
      where: { board_id: boardId },
      select: BOARD_SELECT,
    })
  }

  async createBoard(createBoardDto: CreateBoardDto, userId: string) {
    const { name, description, memberships } = createBoardDto
    const prismaMemberships = memberships?.map((memberId) => ({
      user_id: memberId,
      role: BoardRole.MEMBER,
    }))

    return this.prisma.board.create({
      data: {
        name,
        description,
        owner_id: userId,
        memberships: {
          create: prismaMemberships,
        },
      },
      select: BOARD_SELECT,
    })
  }
}
