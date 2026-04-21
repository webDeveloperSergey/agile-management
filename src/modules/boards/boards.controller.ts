import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { BoardsService } from './boards.service'
import { CreateBoardDto } from './dto/create-board.dto'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'
import { UserRole } from 'prisma/generated/prisma/client'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import type { JwtPayload } from 'src/shared/types/jwt-payload.interface'

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardsService.createBoard(createBoardDto, user.sub)
  }
}
