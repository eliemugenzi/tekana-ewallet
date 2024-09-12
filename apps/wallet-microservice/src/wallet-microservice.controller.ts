import { Controller, Get } from '@nestjs/common';
import { WalletMicroserviceService } from './wallet-microservice.service';

@Controller()
export class WalletMicroserviceController {
  constructor(private readonly walletMicroserviceService: WalletMicroserviceService) {}

  @Get()
  getHello(): string {
    return this.walletMicroserviceService.getHello();
  }
}
