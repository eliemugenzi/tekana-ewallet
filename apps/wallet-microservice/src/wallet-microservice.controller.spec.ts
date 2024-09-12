import { Test, TestingModule } from '@nestjs/testing';
import { WalletMicroserviceController } from './wallet-microservice.controller';
import { WalletMicroserviceService } from './wallet-microservice.service';

describe('WalletMicroserviceController', () => {
  let walletMicroserviceController: WalletMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WalletMicroserviceController],
      providers: [WalletMicroserviceService],
    }).compile();

    walletMicroserviceController = app.get<WalletMicroserviceController>(WalletMicroserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(walletMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
