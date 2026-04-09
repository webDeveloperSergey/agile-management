import { Module } from '@nestjs/common'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
  providers: [UsersService, UsersRepository, JwtGuard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
