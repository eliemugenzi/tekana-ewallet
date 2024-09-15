import { Body, Controller, Inject, OnModuleInit, Post, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {  NewTransactionResponse, TRANSACTION_SERVICE_NAME, TransactionServiceClient } from './transactions.pb';
import { AuthGuard } from '../auth/auth.guard';
import { Observable } from 'rxjs';

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
    private async createTransaction(@Req() req: Request): Promise<Observable<NewTransactionResponse>> {
        const payload: any =  {
            ...req.body,
            userId: req['userId']
        }
        return this.svc.createTransaction(payload);
    }


}
