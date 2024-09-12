import { Module } from '@nestjs/common';
import { TransactionsMicroserviceController } from './transactions-microservice.controller';
import { TransactionsMicroserviceService } from './transactions-microservice.service';

@Module({
  imports: [],
  controllers: [TransactionsMicroserviceController],
  providers: [TransactionsMicroserviceService],
})
export class TransactionsMicroserviceModule {}
