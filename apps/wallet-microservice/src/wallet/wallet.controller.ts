import { Controller } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, DepositMoneyDto, FindWalletDto, GetWalletsDto, TopUpDto, WalletActivityLogsDto, WithdrawMoneyDto } from './wallet.dto';
import { ActivityLogResponse, DepositMoneyResponse, FindWalletResponse, GetWalletsResponse, NewWalletResponse, TopupMoneyResponse, WALLET_SERVICE_NAME, WithdrawMoneyResponse } from './wallet.pb';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @GrpcMethod(WALLET_SERVICE_NAME, "CreateWallet")
    private createWallet(payload: CreateWalletDto): Promise<NewWalletResponse> {
        return this.walletService.createWallet(payload);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, "FindWallet")
    private findWallet(payload: FindWalletDto): Promise<FindWalletResponse> {
        return this.walletService.findWallet(payload);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, "GetWallets")
    private getWallets(payload: GetWalletsDto): Promise<GetWalletsResponse> {
       return this.walletService.getWallets(payload);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, "DepositMoney")
    private depositMoney(data: DepositMoneyDto): Promise<DepositMoneyResponse> {
        return this.walletService.depositMoney(data);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, "WithdrawMoney")
    private withdrawMoney(data: WithdrawMoneyDto): Promise<WithdrawMoneyResponse> {
        return this.walletService.withdrawMoney(data);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, "Topup")
    private topUpMoney(data: TopUpDto): Promise<TopupMoneyResponse> {
        return this.walletService.topUp(data);
    }

    @GrpcMethod(WALLET_SERVICE_NAME, "GetWalletActivityLogs")
    private getTransactionHistory(data: WalletActivityLogsDto): Promise<ActivityLogResponse> {
        return this.walletService.getActivityLog(data);
    }


}
