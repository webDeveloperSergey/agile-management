import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { UserRole } from 'prisma/generated/prisma/client'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'
import type { JwtPayload } from 'src/shared/types/jwt-payload.interface'
import { BoardsService } from './boards.service'
import { CreateBoardDto } from './dto/create-board.dto'
import { UpdateBoardDto } from './dto/update-board.dto'

@UseGuards(JwtGuard, RoleGuard)
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get(':id')
  getBoard(@Param('id') boardId: string, @CurrentUser() user: JwtPayload) {
    return this.boardsService.getBoardById(boardId, user.sub)
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.boardsService.findAllBoards(user.sub)
  }

  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardsService.createBoard(createBoardDto, user.sub)
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  updateBoard(
    @Param('id') boardId: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.updateBoard(boardId, user.sub, updateBoardDto)
  }

  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBoard(@Param('id') boardId: string, @CurrentUser() user: JwtPayload) {
    return this.boardsService.deleteBoardById(boardId, user.sub)
  }

  //members ======================================
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/members/:memberId')
  addMember(
    @Param('id') boardId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardsService.addMember(boardId, memberId, user.sub)
  }

  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/members/:memberId')
  deleteMember(
    @Param('id') boardId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.boardsService.deleteMember(boardId, memberId, user.sub)
  }
}
