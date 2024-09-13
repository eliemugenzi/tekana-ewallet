import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { NewTransactionRequest, ValidateTransactionRequest } from "./transactions.pb";


export class CreateTransactionDto implements NewTransactionRequest {
    @IsString()
    @IsNotEmpty()
    public senderAccountNumber: string;

    @IsString()
    @IsNotEmpty()
   public receiverAccountNumber: string;
    @IsNumber()
    public amount: number;
    @IsNumber()
    public userId: number;
}

export class ValidateTransactionDto implements ValidateTransactionRequest {
    @IsNumber()
    transactionId: number;
}