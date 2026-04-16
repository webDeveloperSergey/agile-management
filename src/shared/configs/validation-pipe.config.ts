import { ValidationPipe } from '@nestjs/common'

export const getValidationPipeConfig = () =>
  new ValidationPipe({
    whitelist: true, // — не даем пройти лишним полям, которых мы не ждем в DTO
    forbidNonWhitelisted: true, // — лишние поля вызывают ошибку
    transform: true,
  })
