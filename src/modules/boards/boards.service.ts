import { Injectable } from '@nestjs/common'
import { BoardsRepository } from './boards.repository'
import { CreateBoardDto } from './dto/create-board.dto'

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  createBoard(createBoardDto: CreateBoardDto, userId: string) {
    console.log(createBoardDto, 'createBoardDto')
    console.log(userId, 'userId')
  }
}
