import { Injectable } from '@nestjs/common'
import { BoardsService } from '../boards/boards.service'
import { ColumnsRepository } from './columns.repository'

@Injectable()
export class ColumnsService {
  constructor(
    private readonly columnsRepository: ColumnsRepository,
    private readonly boardsService: BoardsService,
  ) {}

  async getColumns(boardId: string, userId: string) {
    const board = await this.boardsService.getBoardById(boardId, userId)

    const columns = await this.columnsRepository.getColumnsByBoardId(
      board.board_id,
    )

    return {
      boardId: board.board_id,
      columns,
    }
  }
}
