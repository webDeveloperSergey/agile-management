import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BoardsService } from '../boards/boards.service'
import { ColumnsRepository } from './columns.repository'
import {
  CANNOT_CREATE_COLUMN,
  DELETE_PERMISSION_DENIED,
} from './constants/columns-messages.constants'
import { CreateColumnDto } from './dto/create-column.dto'
import { UpdateColumnDto } from './dto/update-column.dto'

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
    const board = await this.checkOwner(boardId, userId)
    const currentOrder = board.columns.at(-1)?.order ?? 0

    return await this.columnsRepository.createColumn(
      board.board_id,
      createColumnDto.name,
      currentOrder,
    )
  }

  async updateColumns(
    boardId: string,
    userId: string,
    columnId: string,
    updateColumnDto: UpdateColumnDto,
  ) {
    await this.checkOwner(boardId, userId)

    const result = await this.columnsRepository.updateColumn(
      boardId,
      columnId,
      updateColumnDto.name,
    )

    if (result.count === 0)
      throw new NotFoundException(DELETE_PERMISSION_DENIED)

    return await this.columnsRepository.getColumn(columnId)
  }

  async deleteColumn(boardId: string, userId: string, columnId: string) {
    await this.checkOwner(boardId, userId)

    const result = await this.columnsRepository.deleteColumn(boardId, columnId)

    if (result.count === 0)
      throw new NotFoundException(DELETE_PERMISSION_DENIED)
  }

  private async checkOwner(boardId: string, userId: string) {
    const board = await this.boardsService.getBoardById(boardId, userId)

    if (board.owner.user_id !== userId)
      throw new ForbiddenException(CANNOT_CREATE_COLUMN)

    return board
  }
}
