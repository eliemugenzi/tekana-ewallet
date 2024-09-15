import { ApiProperty } from "@nestjs/swagger";

export class NewTransactionRequestDto {
    @ApiProperty({ example: "200-34-1726431580470" })
    senderAccountNumber: string;
    @ApiProperty({ example: "200-34-1726431580474" })
    receiverAccountNumber: string;
    @ApiProperty({ example: 100000 })
    amount: number;
    @ApiProperty({example: 38})
    userId: number;
  }

  export class NewTransactionResponseDto {
    @ApiProperty({example: 201})
    status: number;
    @ApiProperty({example: 'Transaction initiated!'})
    message: string;
    @ApiProperty({example: 3})
    id: number;
  }