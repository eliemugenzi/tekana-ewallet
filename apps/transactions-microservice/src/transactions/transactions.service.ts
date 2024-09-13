import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTransactionDto, ValidateTransactionDto } from './transactions.dto';
import { NewTransactionResponse, ValidateTransactionResponse } from './transactions.pb';
import {
  FindWalletResponse,
  WALLET_SERVICE_NAME,
  WalletServiceClient,
} from './wallet.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService implements OnModuleInit {
  private walletSvc: WalletServiceClient;
  @Inject(WALLET_SERVICE_NAME)
  private readonly client: ClientGrpc;

  constructor(private readonly db: DatabaseService) {}

  onModuleInit() {
      this.walletSvc = this.client.getService<WalletServiceClient>(WALLET_SERVICE_NAME);
  }

  public async createTransaction(
    payload: CreateTransactionDto,
  ): Promise<NewTransactionResponse> {
    const senderWallet: FindWalletResponse = await firstValueFrom(
      this.walletSvc.findWallet({ accountNumber: payload.senderAccountNumber }),
    );

    const receiverWallet: FindWalletResponse = await firstValueFrom(
      this.walletSvc.findWallet({
        accountNumber: payload.receiverAccountNumber,
      }),
    );

    if (senderWallet.status !== HttpStatus.OK) {
      return {
        status: senderWallet.status,
        message: 'Sender account not found',
        id: null,
      };
    }

    if (senderWallet.data.userId !== payload.userId) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'You are not allowed to perform this operation',
        id: null,
      };
    }

    if (receiverWallet.status !== HttpStatus.OK) {
      return {
        status: receiverWallet.status,
        message: 'Receiver wallet not found',
        id: null,
      };
    }

    if (senderWallet.data.balance < payload.amount) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Insufficient funds to perform this operation',
        id: null,
      };
    }

    try {
      // Perform database transactions
      const result = await this.db.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          data: payload,
        });

        const withdrawMoneyData = await firstValueFrom(
          this.walletSvc.withdrawMoney({
            accountNumber: payload.senderAccountNumber,
            amount: payload.amount,
            transactionId: transaction.id,
          }),
        );

        if (![HttpStatus.OK, HttpStatus.CREATED].includes(withdrawMoneyData.status)) {
          await tx.transaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              status: 'FAILED',
            },
          });

          return {
            status: HttpStatus.CONFLICT,
            message: withdrawMoneyData.message,
            id: null
          }
        }

        const depositMoneyData = await firstValueFrom(this.walletSvc.depositMoney({
            accountNumber: payload.receiverAccountNumber,
            amount: payload.amount,
            transactionId: transaction.id
        }))

        if(![HttpStatus.OK, HttpStatus.CREATED].includes(depositMoneyData.status)) {
            await tx.transaction.update({
                where: {
                  id: transaction.id,
                },
                data: {
                  status: 'FAILED',
                },
              });

              const refundTransaction = await tx.transaction.create({
                data: {
                  ...payload,
                
                }
                
              })

             // Implement refund mechanism
             const refundMoney = await firstValueFrom(this.walletSvc.depositMoney({
              accountNumber: payload.senderAccountNumber,
              amount: payload.amount,
              transactionId: refundTransaction.id
             }))

             console.log({ refundMoney })

             if(![HttpStatus.OK, HttpStatus.CREATED].includes(refundMoney.status)) {
              return {
                status: refundMoney.status,
                message: 'Transaction failed and we could not perform refund operation',
                id: null
              }
             }

             return {
              status: depositMoneyData.status,
              message: depositMoneyData.message,
              id: null,
             }

        }

        return {
          status: HttpStatus.OK,
          message: 'Transaction successful!',
          id: transaction.id
        }
      });

      return result;
    } catch (ignored) {
      //TODO: Rollback

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong while performing a transaction.',
        id: null
      }
    }
  }

  public async validateTransaction(data: ValidateTransactionDto): Promise<ValidateTransactionResponse> {
      const transaction = await this.db.transaction.findFirst({
        where: {
          id: data.transactionId
        }
      })

      if(!transaction) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Transaction not found',
          data: null
        }
      }

      return {
        status: HttpStatus.OK,
        message: null,
        data: {
          senderAccountNumber: transaction.senderAccountNumber,
          receiverAccountNumber: transaction.receiverAccountNumber,
          amount: Number(transaction.amount),
          status: transaction.status
        }
      }
  }
}
