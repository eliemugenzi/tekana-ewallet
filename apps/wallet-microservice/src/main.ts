import { NestFactory } from '@nestjs/core';
import { WalletMicroserviceModule } from './wallet-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(WalletMicroserviceModule);
  await app.listen(3000);
}
bootstrap();
