import { Module } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'
import { RoleGuard } from 'src/shared/guards/roles.guard'

@Module({
  providers: [UsersService, UsersRepository, JwtGuard, RoleGuard, Reflector],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
