import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const getSwaggerConfig = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Agile Management API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)
}
