import { IsString, IsNumber, IsEnum } from 'class-validator';
import { DepositMoneyRequest, FindWalletRequest, GetWalletsRequest, NewWalletRequest, TopupMoneyRequest, WithdrawMoneyRequest } from "./wallet.pb";
import { WalletType } from '@prisma/client';

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