import { Body, Controller, HttpStatus, Inject, OnModuleInit, Post, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {  NewTransactionResponse, TRANSACTION_SERVICE_NAME, TransactionServiceClient } from './transactions.pb';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewTransactionRequestDto, NewTransactionResponseDto } from './dto/transaction-request.dto';

@ApiTags("transactions")
@Controller('transaction')
export class TransactionController implements OnModuleInit {
    @Inject(TRANSACTION_SERVICE_NAME)
    private readonly client: ClientGrpc;

    private svc: TransactionServiceClient;

    onModuleInit() {
        this.svc = this.client.getService<TransactionServiceClient>(TRANSACTION_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create a transaction" })
    @ApiBody({ type: NewTransactionRequestDto })
    @ApiBearerAuth()

    @ApiResponse({ status: HttpStatus.CREATED, description: 'Transaction initiated', type: NewTransactionResponseDto })
    private async createTransaction(@Req() req: Request): Promise<Observable<NewTransactionResponse>> {
        const payload: any =  {
            ...req.body,
            userId: req['userId']
        }
        return this.svc.createTransaction(payload);
    }


}
