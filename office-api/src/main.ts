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

  // Project files arrive as base64 inside the JSON body (~33% bigger than the
  // file). Node can't hold strings over ~512M characters, so the practical
  // ceiling is a ~380MB file; the body limit just stays above that.
  app.use(json({ limit: '550mb' }));

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
