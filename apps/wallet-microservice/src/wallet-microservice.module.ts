import { Module } from '@nestjs/common';
import { WalletMicroserviceController } from './wallet-microservice.controller';
import { WalletMicroserviceService } from './wallet-microservice.service';

@Module({
  imports: [],
  controllers: [WalletMicroserviceController],
  providers: [WalletMicroserviceService],
})
export class WalletMicroserviceModule {}
