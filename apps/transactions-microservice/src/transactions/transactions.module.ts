import { Global, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME, WALLETS_PACKAGE_NAME } from './wallet.pb';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule } from '@nestjs/config';


@Global()
@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register(
      [
        {
          name: WALLET_SERVICE_NAME,
          transport: Transport.GRPC,
          options: {
            url: `${process.env.WALLET_SERVICE_URL}:${process.env.WALLETS_PORT}`,
            protoPath: 'node_modules/tew-protos/wallet.proto',
            package: WALLETS_PACKAGE_NAME
          }
        }
      ]
    )
  ]
})
export class TransactionsModule {}
