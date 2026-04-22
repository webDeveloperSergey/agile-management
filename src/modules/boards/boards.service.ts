import { Injectable } from '@nestjs/common'
import { BoardsRepository } from './boards.repository'
import { CreateBoardDto } from './dto/create-board.dto'

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  async getBoardById(boardId: string) {
    return await this.boardsRepository.getBoard(boardId)
  }

  async createBoard(createBoardDto: CreateBoardDto, userId: string) {
    return await this.boardsRepository.createBoard(createBoardDto, userId)
  }
}
