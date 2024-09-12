import { IsString, IsNumber, IsEnum } from 'class-validator';
import { FindWalletRequest, GetWalletsRequest, NewWalletRequest } from "./wallet.pb";
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