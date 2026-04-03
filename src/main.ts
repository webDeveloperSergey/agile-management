import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // — не даем пройти лишним полям, которых мы не ждем в DTO
      forbidNonWhitelisted: true, // — лишние поля вызывают ошибку
    }),
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((err) => console.error('Error starting the application', err))
