import { ForbiddenException, Injectable } from '@nestjs/common'
import { BoardsService } from '../boards/boards.service'
import { ColumnsRepository } from './columns.repository'
import { CANNOT_CREATE_COLUMN } from './dto/columns-messages.constants'
import { CreateColumnDto } from './dto/create-column.dto'

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

  async createColumn(
    boardId: string,
    userId: string,
    createColumnDto: CreateColumnDto,
  ) {
    const board = await this.boardsService.getBoardById(boardId, userId)
    const currentOrder = board.columns.at(-1)?.order ?? 0

    if (board.owner.user_id !== userId)
      throw new ForbiddenException(CANNOT_CREATE_COLUMN)

    return await this.columnsRepository.createColumn(
      board.board_id,
      createColumnDto.name,
      currentOrder,
    )
  }
}
