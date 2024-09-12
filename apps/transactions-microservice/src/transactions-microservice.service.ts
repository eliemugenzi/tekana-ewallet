import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
