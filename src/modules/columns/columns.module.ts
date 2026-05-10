import { Module } from '@nestjs/common'
import { ColumnsService } from './columns.service'
import { ColumnsController } from './columns.controller'
import { ColumnsRepository } from './columns.repository'
import { BoardsModule } from '../boards/boards.module'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'
import { Reflector } from '@nestjs/core'

@Module({
  imports: [BoardsModule],
  controllers: [ColumnsController],
  providers: [
    ColumnsService,
    ColumnsRepository,
    JwtGuard,
    RoleGuard,
    Reflector,
  ],
})
export class ColumnsModule {}
