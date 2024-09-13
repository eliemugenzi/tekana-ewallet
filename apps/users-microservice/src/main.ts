import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USERS_PACKAGE_NAME } from './auth/users.pb';

async function bootstrap() {
  const app: INestMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        protoPath: join('node_modules/tew-protos/users.proto'),
        package: USERS_PACKAGE_NAME,
        url: `${process.env.URL}:${process.env.USERS_PORT}`,
      },
    });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
