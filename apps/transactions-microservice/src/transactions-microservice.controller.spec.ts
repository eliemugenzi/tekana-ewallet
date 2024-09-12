import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsMicroserviceController } from './transactions-microservice.controller';
import { TransactionsMicroserviceService } from './transactions-microservice.service';

describe('TransactionsMicroserviceController', () => {
  let transactionsMicroserviceController: TransactionsMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsMicroserviceController],
      providers: [TransactionsMicroserviceService],
    }).compile();

    transactionsMicroserviceController = app.get<TransactionsMicroserviceController>(TransactionsMicroserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(transactionsMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
