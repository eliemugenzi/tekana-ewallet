import { Controller } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, ValidateTransactionDto } from './transactions.dto';
import { NewTransactionResponse, TRANSACTION_SERVICE_NAME, ValidateTransactionResponse } from './transactions.pb';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) {}

    @GrpcMethod(TRANSACTION_SERVICE_NAME, "CreateTransaction")
    private createTransaction(data: CreateTransactionDto): Promise<NewTransactionResponse> {
        return this.transactionService.createTransaction(data);
    }

    @GrpcMethod(TRANSACTION_SERVICE_NAME, 'ValidateTransaction')
    private validateTransaction(data: ValidateTransactionDto): Promise<ValidateTransactionResponse> {
        return this.transactionService.validateTransaction(data);
    }
}
