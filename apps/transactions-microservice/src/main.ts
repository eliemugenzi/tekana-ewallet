import { NestFactory } from '@nestjs/core';
import { TransactionsMicroserviceModule } from './transactions-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsMicroserviceModule);
  await app.listen(3000);
}
bootstrap();
