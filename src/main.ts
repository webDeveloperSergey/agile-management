import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { getSwaggerConfig } from './shared/configs/swagger.config'
import { getValidationPipeConfig } from './shared/configs/validation-pipe.config'
import { getCorsConfig } from './shared/configs/cors.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(getValidationPipeConfig())

  app.use(cookieParser())
  app.enableCors(getCorsConfig())

  getSwaggerConfig(app)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((err) => console.error('Error starting the application', err))
