import { Body, Controller, Get, HttpStatus, Inject, OnModuleInit, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ActivityLogResponse, DepositMoneyRequest, DepositMoneyResponse, FindWalletRequest, FindWalletResponse, GetWalletsRequest, GetWalletsResponse, NewWalletRequest, NewWalletResponse, TopupMoneyRequest, TopupMoneyResponse, WALLET_SERVICE_NAME, WalletServiceClient } from './wallet.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {  DepositMoneyRequestDto, NewWalletRequestDto, TopupMoneyRequestDto } from './dto/wallet-request.dto';
import { ActivityLogResponseDto, DepositMoneyResponseDto, FindWalletResponseDto, GetWalletsResponseDto, NewWalletResponseDto, TopupMoneyResponseDto } from './dto/wallet-response.dto';

@ApiTags("wallet")
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
    @ApiOperation({summary: 'Create a wallet'})
    @ApiBody({type: NewWalletRequestDto})
    @ApiBearerAuth()

    @ApiResponse({status: HttpStatus.CREATED, description: 'Wallet created', type: NewWalletResponseDto})
    private async createWallet(@Req() req: Request): Promise<Observable<NewWalletResponse>> {
        const payload: NewWalletRequest = req.body;
        payload.userId = req['userId'];
        return this.svc.createWallet(payload);
    } 

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get wallets'})
    @ApiBearerAuth()

    @ApiResponse({status: HttpStatus.OK, description: 'Wallets retrieved', type: GetWalletsResponseDto})
    private async getWallets(@Req() req: Request): Promise<Observable<GetWalletsResponse>> {
        const payload: GetWalletsRequest = {
            userId: req['userId']
        }

        return this.svc.getWallets(payload);
    }

    @Get(':accountNumber')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Find wallet by account number'})
    @ApiBearerAuth()
    @ApiParam({name: 'accountNumber', required: true, type: Number, description: 'Account number', example: '200-34-1726431580470'})
   @ApiResponse({status: HttpStatus.OK, description: 'Wallet found', type: FindWalletResponseDto})
    private async getWalletByAccountNumber(@Param('accountNumber') accountNumber: string): Promise<Observable<FindWalletResponse> >{
      const body: FindWalletRequest = { 
         accountNumber

      }

      return this.svc.findWallet(body);
    }

    @Post('/deposit')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary: 'Deposit money to a specific wallet'
    })
    @ApiBody({type: DepositMoneyRequestDto})
    @ApiBearerAuth()

    @ApiResponse({ status: HttpStatus.OK, description: 'Money deposited', type: DepositMoneyResponseDto })
    private async depositMoney(@Body() body: DepositMoneyRequest): Promise<Observable<DepositMoneyResponse>> {
       return this.svc.depositMoney(body);
    }

    @Post('/topup')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Topup the wallet'})
    @ApiBody({type: TopupMoneyRequestDto})
    @ApiBearerAuth()

    @ApiResponse({status: HttpStatus.OK, description: 'Topup successful', type: TopupMoneyResponseDto})
    private async topUpWallet(@Body() body: TopupMoneyRequest): Promise<Observable<TopupMoneyResponse>> {
      return this.svc.topup(body);
    }

    @Get('/:accountNumber/transactions')
    @UseGuards(AuthGuard)
    @ApiOperation({summary: 'Get recent transactions that were made on a specific account'})
    @ApiResponse({type: ActivityLogResponseDto, status: HttpStatus.OK, description: 'Transactions found'})
    @ApiParam({name: 'accountNumber', required: true, type: Number, description: 'Account number', example: '200-34-1726431580470'})
    @ApiQuery({name: 'page', type: Number, required: false, example: 1, description: 'The current page in the pagination'})
    @ApiQuery({name: 'limit', type: Number, required: false, example: 10, description: 'The data limit'})
    @ApiBearerAuth()
    private async getTransactionHistory(@Query('page') page: number, @Query('limit') limit: number, @Param('accountNumber') accountNumber: string): Promise<Observable<ActivityLogResponse>> {
       return this.svc.getWalletActivityLogs({
        accountNumber,
        page,
        limit
       })
    }


}
