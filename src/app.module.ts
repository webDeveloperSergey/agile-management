import { Module } from '@nestjs/common'
import { CoreModule } from './core/core.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [CoreModule, UsersModule, AuthModule],
})
export class AppModule {}
