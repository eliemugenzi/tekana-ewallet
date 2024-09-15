import { Global, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME, WALLETS_PACKAGE_NAME } from './wallet.pb';

@Global()
@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [
    ClientsModule.register(
      [
        {
          name: WALLET_SERVICE_NAME,
          transport: Transport.GRPC,
          options: {
            package: WALLETS_PACKAGE_NAME,
            protoPath: 'node_modules/tew-protos/wallet.proto',
            url: `${process.env.WALLET_SERVICE_URL}:${process.env.WALLET_SERVICE_PORT}`
          }
        }
      ]
    )
  ]
})
export class WalletModule {}
