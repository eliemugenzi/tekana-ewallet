import { Controller } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, FindWalletDto, GetWalletsDto } from './wallet.dto';
import { FindWalletResponse, GetWalletsResponse, NewWalletResponse, WALLET_SERVICE_NAME } from './wallet.pb';
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

}
