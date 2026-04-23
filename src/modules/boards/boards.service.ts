import { Injectable, NotFoundException } from '@nestjs/common'
import { BoardsRepository } from './boards.repository'
import {
  DELETE_PERMISSION_DENIED,
  NOT_FOUND_BY_ID,
  UPDATE_PERMISSION_DENIED,
} from './constants/boards-messages.constants'
import { CreateBoardDto } from './dto/create-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

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

  async updateBoard(
    boardId: string,
    userId: string,
    updateBoardDto: UpdateBoardDto,
  ) {
    const updatedBoard = await this.boardsRepository.updateBoard(
      boardId,
      userId,
      updateBoardDto,
    )

    if (updatedBoard.count === 0)
      throw new NotFoundException(UPDATE_PERMISSION_DENIED)

    const findUpdatedBoard = await this.boardsRepository.getBoard(
      boardId,
      userId,
    )

    return findUpdatedBoard
  }

  async deleteBoardById(boardId: string, userId: string) {
    const result = await this.boardsRepository.deleteBoard(boardId, userId)

    if (result.count === 0)
      throw new NotFoundException(DELETE_PERMISSION_DENIED)
  }

  //members ======================================
  async deleteMember(boardId: string, memberId: string, userId: string) {
    const boardByOwner = await this.boardsRepository.getBoardByOwner(
      boardId,
      userId,
    )

    if (!boardByOwner) throw new NotFoundException(DELETE_PERMISSION_DENIED)

    await this.boardsRepository.deleteMember(boardId, memberId)
  }
}
