import { Controller, Get } from '@nestjs/common';
import { TransactionsMicroserviceService } from './transactions-microservice.service';

@Controller()
export class TransactionsMicroserviceController {
  constructor(private readonly transactionsMicroserviceService: TransactionsMicroserviceService) {}

  @Get()
  getHello(): string {
    return this.transactionsMicroserviceService.getHello();
  }
}
