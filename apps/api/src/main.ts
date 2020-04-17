import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app
    .setGlobalPrefix(globalPrefix)
    .useGlobalPipes(new ValidationPipe());

  const documentOptions = new DocumentBuilder()
    .setTitle('Image Resizer API')
    .setDescription('An easy to use image resizing!')
    .setVersion('1.0')
    .addTag('images')
    .build();

  const document = SwaggerModule.createDocument(app, documentOptions);
  
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3333;
  
  await app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/${globalPrefix}`);
  });
}

bootstrap();
