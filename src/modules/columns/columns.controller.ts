import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'
import type { JwtPayload } from 'src/shared/types/jwt-payload.interface'
import { ColumnsService } from './columns.service'
import { CreateColumnDto } from './dto/create-column.dto'

@UseGuards(JwtGuard, RoleGuard)
@Controller('boards/:boardId/columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  getColumns(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.columnsService.getColumns(boardId, user.sub)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createColumn(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @CurrentUser() user: JwtPayload,
    @Body() createColumnDto: CreateColumnDto,
  ) {
    return this.columnsService.createColumn(boardId, user.sub, createColumnDto)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteColumn(
    @Param('boardId', ParseUUIDPipe) boardId: string,
    @Param('id', ParseUUIDPipe) columnId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.columnsService.deleteColumn(boardId, user.sub, columnId)
  }
}
