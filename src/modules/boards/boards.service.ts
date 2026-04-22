import { Injectable, NotFoundException } from '@nestjs/common'
import { BoardsRepository } from './boards.repository'
import { CreateBoardDto } from './dto/create-board.dto'
import { NOT_FOUND_BY_ID } from './constants/boards-messages.constants'

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  async findAllBoards(userId: string) {
    return await this.boardsRepository.findAllBoards(userId)
  }

  async getBoardById(boardId: string, userId: string) {
    const board = await this.boardsRepository.getBoard(boardId, userId)

    if (!board) throw new NotFoundException(NOT_FOUND_BY_ID)

    return board
  }

  async createBoard(createBoardDto: CreateBoardDto, userId: string) {
    return await this.boardsRepository.createBoard(createBoardDto, userId)
  }
}
