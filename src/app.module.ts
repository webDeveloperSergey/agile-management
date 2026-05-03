import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { BoardsModule } from './modules/boards/boards.module'
import { ColumnsModule } from './modules/columns/columns.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule, BoardsModule, ColumnsModule],
})
export class AppModule {}
