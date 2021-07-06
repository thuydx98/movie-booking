import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  await app.listen(AppConfig.env.PORT);
}
bootstrap();
