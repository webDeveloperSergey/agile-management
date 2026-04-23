import { Injectable } from '@nestjs/common'
import { BoardRole } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { BOARD_SELECT } from './constants/selects.constants'
import { CreateBoardDto } from './dto/create-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBoards(userId: string) {
    return this.prisma.board.findMany({
      where: {
        OR: [
          {
            owner_id: userId,
          },
          {
            memberships: { some: { user_id: userId } },
          },
        ],
      },
      select: BOARD_SELECT,
    })
  }

  async getBoard(boardId: string, userId: string) {
    return this.prisma.board.findUnique({
      where: {
        board_id: boardId,
        OR: [
          { owner_id: userId },
          { memberships: { some: { user_id: userId } } },
        ],
      },
      select: BOARD_SELECT,
    })
  }

  async getBoardByOwner(boardId: string, userId: string) {
    return this.prisma.board.findUnique({
      where: { board_id: boardId, owner_id: userId },
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

  async updateBoard(
    boardId: string,
    userId: string,
    updateBoardDto: UpdateBoardDto,
  ) {
    const { name, description } = updateBoardDto

    return await this.prisma.board.updateMany({
      where: { board_id: boardId, owner_id: userId },
      data: {
        name,
        description,
      },
    })
  }

  async deleteBoard(boardId: string, userId: string) {
    return await this.prisma.board.deleteMany({
      where: { board_id: boardId, owner_id: userId },
    })
  }

  //members ======================================
  async addMember(boardId: string, memberId: string) {
    return await this.prisma.boardMembership.create({
      data: {
        board_id: boardId,
        user_id: memberId,
        role: BoardRole.MEMBER,
      },
    })
  }

  async findMember(boardId: string, memberId: string) {
    return await this.prisma.boardMembership.findUnique({
      where: {
        board_id_user_id: {
          board_id: boardId,
          user_id: memberId,
        },
      },
    })
  }

  async deleteMember(boardId: string, memberId: string) {
    return await this.prisma.boardMembership.deleteMany({
      where: {
        board_id: boardId,
        user_id: memberId,
      },
    })
  }
}
