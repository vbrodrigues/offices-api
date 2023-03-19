import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ forbidUnknownValues: false, transform: true }),
  );

  app.use(json({ limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('Office API')
    .setDescription('API to manage your office client, projects and employees.')
    .setVersion('1.0')
    .addTag('office')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
