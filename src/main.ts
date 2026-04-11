import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // — не даем пройти лишним полям, которых мы не ждем в DTO
      forbidNonWhitelisted: true, // — лишние поля вызывают ошибку
    }),
  )

  app.use(cookieParser())

  app.enableCors({
    // Не блокирует запросы с фронтенда на бэкенд если они на разных доменах
    origin: [process.env.CLIENT_URL], // разрешаем только наш фронт

    // HttpOnly кука с refresh_token будет автоматически прилетать с каждым запросом с фронта
    credentials: true, //  Без этого браузер не отправляет куки в cross-origin запросах

    exposedHeaders: 'set-cookie', // Без этого фронтенд не увидит что кука была установлена
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap().catch((err) => console.error('Error starting the application', err))
