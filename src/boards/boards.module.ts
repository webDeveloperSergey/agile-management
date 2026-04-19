import { Module } from '@nestjs/common'
import { BoardsService } from './boards.service'
import { BoardsController } from './boards.controller'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'
import { Reflector } from '@nestjs/core'
import { BoardsRepository } from './boards.repository'

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, JwtGuard, RoleGuard, Reflector],
})
export class BoardsModule {}
