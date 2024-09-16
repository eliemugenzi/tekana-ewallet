import { IsString, IsNumber, IsEnum, Min } from 'class-validator';
import { ActivityLogRequest, DepositMoneyRequest, FindWalletRequest, GetWalletsRequest, NewWalletRequest, TopupMoneyRequest, WithdrawMoneyRequest } from "./wallet.pb";

enum WalletType {
    SAVING,
    LOAN,
    PERSONAL
}

export class CreateWalletDto implements NewWalletRequest {
    @IsNumber()
    userId: number;
    @IsEnum(WalletType)
    type: 'SAVING' | 'LOAN' | 'PERSONAL';
}

export class FindWalletDto implements FindWalletRequest {
    @IsString()
    accountNumber: string;
}

export class GetWalletsDto implements GetWalletsRequest {
    @IsNumber()
    userId: number;
}

export class WithdrawMoneyDto implements WithdrawMoneyRequest {
    @IsString()
    accountNumber: string;
    @IsNumber()
    amount: number;
    @IsNumber()
    transactionId: number;
}

export class DepositMoneyDto implements DepositMoneyRequest {
    @IsString()
    accountNumber: string;
    
    @IsNumber()
    amount: number;
    
    @IsNumber()
    transactionId: number;
}

export class TopUpDto implements TopupMoneyRequest {
    @IsString()
    accountNumber: string;

    @IsNumber()
    amount: number;
}

export class WalletActivityLogsDto implements ActivityLogRequest {
    @IsString()
    accountNumber: string;
    @IsNumber()
    @Min(1)
    page: number;
    @IsNumber()
    @Min(5)
    limit: number;
}