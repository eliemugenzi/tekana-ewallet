import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateWalletDto,
  DepositMoneyDto,
  FindWalletDto,
  GetWalletsDto,
  TopUpDto,
  WithdrawMoneyDto,
} from './wallet.dto';
import {
  DepositMoneyResponse,
  FindWalletResponse,
  GetWalletsResponse,
  NewWalletResponse,
  TopupMoneyResponse,
  WithdrawMoneyResponse,
} from './wallet.pb';
import { TRANSACTION_SERVICE_NAME, TransactionServiceClient } from './transactions.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WalletService implements OnModuleInit {
  private transactionSvc: TransactionServiceClient;

  @Inject(TRANSACTION_SERVICE_NAME)
  private readonly client: ClientGrpc;

  constructor(private readonly db: DatabaseService) {}

  onModuleInit() {
      this.transactionSvc = this.client.getService<TransactionServiceClient>(TRANSACTION_SERVICE_NAME);
  }

  public async createWallet(
    payload: CreateWalletDto,
  ): Promise<NewWalletResponse> {
    console.log({ payload })
    const accountNumber = this.generateAccountNumber(payload.userId);

    await this.db.wallet.create({
      data: {
        ...payload,
        accountNumber,
      },
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Wallet has been created!',
    };
  }

  public async findWallet(payload: FindWalletDto): Promise<FindWalletResponse> {
    const foundWallet = await this.db.wallet.findFirst({
      where: {
        accountNumber: payload.accountNumber,
      },
      select: {
        id: true,
        accountNumber: true,
        userId: true,
        type: true,
        balance: true,
        activityLogs: true,
      },
    });

    if (!foundWallet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Wallet not found',
        data: null,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Wallet retrieved',
      data: foundWallet,
    };
  }

  public async getWallets(payload: GetWalletsDto): Promise<GetWalletsResponse> {
    const wallets = await this.db.wallet.findMany({
      where: {
        userId: payload.userId,
      },
      select: {
        id: true,
        accountNumber: true,
        userId: true,
        type: true,
        balance: true,
        activityLogs: true,
      },
    });

    return {
      status: HttpStatus.OK,
      message: null,
      data: wallets,
    };
  }

  public async withdrawMoney(
    data: WithdrawMoneyDto,
  ): Promise<WithdrawMoneyResponse> {
    const foundTransaction = await firstValueFrom(this.transactionSvc.validateTransaction({ transactionId: data.transactionId }));

    if(foundTransaction.status !== HttpStatus.OK) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid transaction'
      }
    }
    const wallet = await this.db.wallet.findFirst({
      where: {
        accountNumber: data.accountNumber,
      },
    });

    if (!wallet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Wallet not found',
      };
    }

    if (Number(wallet.balance) < data.amount) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Insufficient balance to perform this operation',
      };
    }

    const similarActivity = await this.db.walletActivityLog.findFirst({
      where: {
        transactionId: data.transactionId,
        action: 'DEBIT',
      },
    });

    if (similarActivity) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'This activity already happened',
      };
    }

    try {
      const result = await this.db.$transaction(async (tx) => {
        await tx.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balance: {
              decrement: data.amount,
            },
          },
        });

        await tx.walletActivityLog.create({
            data: {
                walletId: wallet.id,
                amount: data.amount,
                action: 'DEBIT',
                transactionId: data.transactionId
            }
        })

        return {
          status: HttpStatus.OK,
          message: 'Withdrawal is successful!'
        }
      });

      return result;
    } catch (ignored) {
      //TODO:  Rollback
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!'
      }
    }
  }

  public async depositMoney(
    data: DepositMoneyDto,
  ): Promise<DepositMoneyResponse> {
    const foundTransaction = await firstValueFrom(this.transactionSvc.validateTransaction({ transactionId: data.transactionId }));

    if(foundTransaction.status !== HttpStatus.OK) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid transaction'
      }
    }

    const wallet = await this.db.wallet.findFirst({
      where: {
        accountNumber: data.accountNumber,
      },
    });

    if (!wallet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Wallet not found',
      };
    }

    const similarOperation = await this.db.walletActivityLog.findFirst({
      where: {
        transactionId: data.transactionId,
        action: 'CREDIT',
      },
    });
    if (similarOperation) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'It seems this operation already happened',
      };
    }

    try {
      const result = await this.db.$transaction(async (tx) => {
        await tx.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balance: {
              increment: data.amount,
            },
          },
        });

        await tx.walletActivityLog.create({
            data: {
                walletId: wallet.id,
                transactionId: data.transactionId,
                action: 'CREDIT',
                amount: data.amount
        
            }
        })

        return {
          status: HttpStatus.CREATED,
          message: 'Done'
        }
      });

      return result;

      
    } catch (ignored) {
      //TODO: Rollback

      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong...'
      }
    }
  }

  public async topUp(data: TopUpDto): Promise<TopupMoneyResponse> {
    const foundWallet = await this.db.wallet.findFirst({
      where: {
        accountNumber: data.accountNumber
      }
    })

    if(!foundWallet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Wallet not found'
      }
    }

    await this.db.wallet.update({
      where: {
        id: foundWallet.id
      },
      data: {
        balance: {
          increment: data.amount
        }
      }
    })

    return {
      status: HttpStatus.OK,
      message: 'Wallet topup complete!'
    }
  }

  private generateAccountNumber(userId: number): string {
    return `200-${userId.toString()}-${Number(Date.now()).toString()}`;
  }
}
