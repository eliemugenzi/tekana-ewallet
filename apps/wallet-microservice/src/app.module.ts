import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [ConfigModule.forRoot(), WalletModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }],

})
export class AppModule {}
