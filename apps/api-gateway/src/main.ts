import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './app.module';

async function bootstrap() {
  console.log('ENV___', process.env);
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(process.env.PORT);
}
bootstrap();
