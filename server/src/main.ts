import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());

  admin.initializeApp({
    credential: admin.credential.cert('./firebase-key.json'),
  });

  await app.listen(3000);
}
bootstrap();
