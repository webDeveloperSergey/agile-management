import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import { isDevMode } from '../utils/is-dev-mode.util'
export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  global: true,
  secret: configService.get('JWT_SECRET'),
  signOptions: {
    expiresIn: isDevMode(configService)
      ? '24h'
      : configService.get('JWT_EXPIRES_IN'),
  },
})
