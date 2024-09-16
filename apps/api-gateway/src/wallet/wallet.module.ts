import { Global, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME, WALLETS_PACKAGE_NAME } from './wallet.pb';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';


@Global()
@Module({
  controllers: [WalletController],
  providers: [WalletService, {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor
  }],
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
    ),
    CacheModule.register({
      store: redisStore as any,
      host: process.env.REDIS_HOST,
      port: 6379,
      ttl: 60,
      max: 100
     })
  ]
})
export class WalletModule {}
