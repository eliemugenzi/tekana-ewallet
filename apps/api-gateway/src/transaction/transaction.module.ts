import { Global, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TRANSACTION_SERVICE_NAME,
  TRANSACTIONS_PACKAGE_NAME,
} from './transactions.pb';

@Global()
@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: TRANSACTIONS_PACKAGE_NAME,
          protoPath: 'node_modules/tew-protos/transactions.proto',
          url: `${process.env.TRANSACTIONS_SERVICE_URL}:${process.env.TRANSACTIONS_SERVICE_PORT}`,
        },
      },
    ]),
  ],
})
export class TransactionModule {}
