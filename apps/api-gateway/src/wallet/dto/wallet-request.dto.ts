import { ApiProperty } from "@nestjs/swagger";

export class NewWalletRequestDto {
    @ApiProperty({example: 38})
    userId: number;
    @ApiProperty({example: 'PERSONAL'})
    type: string;
  }
  
  export class FindWalletRequestDto {
    @ApiProperty({example: '200-34-1726431580470'})
    accountNumber: string;
  }

  export class GetWalletsRequestDto {
    @ApiProperty({ example: 38 })
    userId: number;
  }
  

  export class DepositMoneyRequestDto {
    @ApiProperty({ example: '200-34-1726431580470' })
    accountNumber: string;
    @ApiProperty({example: 2000})
    amount: number;
    @ApiProperty({example: 102})
    transactionId: number;
  }

  export class WithdrawMoneyRequestDto {
    @ApiProperty({ example: '200-34-1726431580470' })
    accountNumber: string;
    @ApiProperty({example: 20200})
    amount: number;
    @ApiProperty({example: 902})
    transactionId: number;
  }

  export class TopupMoneyRequestDto {
    @ApiProperty({example: '200-34-1726431580470'})
    accountNumber: string;
    @ApiProperty({example: 50000})
    amount: number;
  }

  export class ActivityLogRequestDto {
    @ApiProperty({example: 1})
    page: number;
    @ApiProperty({example: 10})
    limit: number;
  }
  