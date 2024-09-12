import { Injectable } from '@nestjs/common';

@Injectable()
export class WalletMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
