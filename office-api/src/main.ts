import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({ forbidUnknownValues: false, transform: true }),
  );

  // Project files go straight to storage through presigned URLs; only logos
  // and avatars (images up to 10MB) still arrive as base64 in the JSON body,
  // which makes them ~33% bigger.
  app.use(json({ limit: '20mb' }));

  const config = new DocumentBuilder()
    .setTitle('Office API')
    .setDescription('API to manage your office client, projects and employees.')
    .setVersion('1.0')
    .addTag('office')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Hosting platforms (e.g. Render) set PORT
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
