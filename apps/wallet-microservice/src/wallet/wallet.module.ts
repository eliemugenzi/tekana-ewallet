import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { DatabaseService } from 'src/database/database.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRANSACTION_SERVICE_NAME, TRANSACTIONS_PACKAGE_NAME } from './transactions.pb';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletActivityLog } from './entities/wallet-activity-log.entity';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [TypeOrmModule.forFeature([Wallet, WalletActivityLog]),
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.TRANSACTIONS_SERVICE_URL}:${process.env.TRANSACTIONS_PORT}`,
          protoPath: 'node_modules/tew-protos/transactions.proto',
          package: TRANSACTIONS_PACKAGE_NAME
        }
      }
    ])
  ]
})
export class WalletModule {}
