import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
     AuthModule,
      WalletModule,
       TransactionModule,
     
      ],
  controllers: [AppController],
  providers: [AppService],
})
export class ApiGatewayModule {}
