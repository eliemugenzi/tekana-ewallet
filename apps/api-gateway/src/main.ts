import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Tekana eWallet')
  .setDescription('Mobile wallet for financial transactions')
  .setVersion('1.0')
  .addTag('wallet')
  .addTag('auth')
  .addTag('transactions')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
