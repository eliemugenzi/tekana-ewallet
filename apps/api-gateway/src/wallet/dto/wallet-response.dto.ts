import { ApiProperty } from "@nestjs/swagger";

export class WalletActivityLog {
    @ApiProperty({example: 100})
    transactionId: number;
    @ApiProperty({ example: 'DEBIT' })
    action: string;
    @ApiProperty({example: 1000000})
    amount: number;
  }

export class WalletData {
    @ApiProperty({example: 1})
    id: number;
    @ApiProperty({example: '200-34-1726431580470'})
    accountNumber: string;
    @ApiProperty({example: 29})
    userId: number;
    @ApiProperty({example: 'LOAN'})
    type: string;
    @ApiProperty({example: 4000000})
    balance: number;
    @ApiProperty()
    activityLogs: WalletActivityLog[];
  }
export class NewWalletResponseDto {
    @ApiProperty({example: 201})
    status: number;
    @ApiProperty({example: 'Wallet created!'})
    message: string;
  }

  export class FindWalletResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'Wallet found'})
    message: string;
    @ApiProperty()
    data: WalletData | undefined;
  }

  export class GetWalletsResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'Wallets found'})
    message: string;
    @ApiProperty()
    data: WalletData[];
  }

  export class DepositMoneyResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'Money deposited'})
    message: string;
  }

  export class WithdrawMoneyResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'Amount has been withdrawn successfully!'})
    message: string;
  }

  export class TopupMoneyResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'Topup successful!'})
    message: string;
  }

  export class ActivityLogResponseMeta {
    @ApiProperty({example: 1})
    page: number;
    @ApiProperty({example: 20})
    pages: number;
    @ApiProperty({example: 200})
    total: number;
  }

  export class ActivityLogResponseDto {
    @ApiProperty({example: 200})
    status: number;
    @ApiProperty({example: 'Activity logs retrieved'})
    message: string;
    @ApiProperty()
    data: WalletActivityLog[];
    meta: ActivityLogResponseMeta | undefined;
  }

  

 
  