import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { BoardsModule } from './modules/boards/boards.module'

@Module({
  imports: [CoreModule, UsersModule, AuthModule, BoardsModule],
})
export class AppModule {}
