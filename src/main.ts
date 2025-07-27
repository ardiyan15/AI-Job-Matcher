import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressLayouts from 'express-ejs-layouts';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser())
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', './layouts/main');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
