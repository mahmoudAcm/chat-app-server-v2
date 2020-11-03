import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowList = ['http://localhost:3000'];
  app.enableCors({
    origin: allowList,
  });
  await app.listen(3001);
}
bootstrap();
