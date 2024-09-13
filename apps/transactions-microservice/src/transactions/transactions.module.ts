import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DatabaseService } from '../database/database.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME, WALLETS_PACKAGE_NAME } from './wallet.pb';

@Module({
  providers: [TransactionsService, DatabaseService],
  controllers: [TransactionsController],
  imports: [
    ClientsModule.register(
      [
        {
          name: WALLET_SERVICE_NAME,
          transport: Transport.GRPC,
          options: {
            url: `${process.env.URL}:${process.env.WALLETS_PORT}`,
            protoPath: 'node_modules/tew-protos/wallet.proto',
            package: WALLETS_PACKAGE_NAME
          }
        }
      ]
    )
  ]
})
export class TransactionsModule {}
