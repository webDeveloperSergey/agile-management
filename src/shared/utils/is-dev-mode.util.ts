import { ConfigService } from '@nestjs/config'

export const isDevMode = (configService: ConfigService) =>
  configService.get<string>('MODE') === 'development'
