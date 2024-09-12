import { Controller, Get, Inject, OnModuleInit, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FindWalletRequest, FindWalletResponse, GetWalletsRequest, GetWalletsResponse, NewWalletRequest, NewWalletResponse, WALLET_SERVICE_NAME, WalletServiceClient } from './wallet.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Controller('wallet')
export class WalletController implements OnModuleInit {
    @Inject(WALLET_SERVICE_NAME)
    private readonly client: ClientGrpc;
    private svc: WalletServiceClient;

    onModuleInit() {
        this.svc = this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    private async createWallet(@Req() req: Request): Promise<Observable<NewWalletResponse>> {
        const payload: NewWalletRequest = req.body;
        payload.userId = req['userId'];
        return this.svc.createWallet(payload);
    } 

    @Get()
    @UseGuards(AuthGuard)
    private async getWallets(@Req() req: Request): Promise<Observable<GetWalletsResponse>> {
        const payload: GetWalletsRequest = {
            userId: req['userId']
        }

        return this.svc.getWallets(payload);
    }

    @Get(':accountNumber')
    @UseGuards(AuthGuard)
    private async getWalletByAccountNumber(@Param('accountNumber') accountNumber: string): Promise<Observable<FindWalletResponse> >{
      const body: FindWalletRequest = { 
         accountNumber

      }

      return this.svc.findWallet(body);
    }


}
