import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [WalletService, DatabaseService],
  controllers: [WalletController],
})
export class WalletModule {}
