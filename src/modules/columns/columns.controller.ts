import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ColumnsService } from './columns.service'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import type { JwtPayload } from 'src/shared/types/jwt-payload.interface'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'

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
}
