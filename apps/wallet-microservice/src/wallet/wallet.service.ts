import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateWalletDto,
  DepositMoneyDto,
  FindWalletDto,
  GetWalletsDto,
  TopUpDto,
  WalletActivityLogsDto,
  WithdrawMoneyDto,
} from './wallet.dto';
import {
  ActivityLogResponse,
  DepositMoneyResponse,
  FindWalletResponse,
  GetWalletsResponse,
  NewWalletResponse,
  TopupMoneyResponse,
  WithdrawMoneyResponse,
} from './wallet.pb';
import {
  TRANSACTION_SERVICE_NAME,
  TransactionServiceClient,
} from './transactions.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { WalletActivityLog } from './entities/wallet-activity-log.entity';

@Injectable()
export class WalletService implements OnModuleInit {
  @InjectRepository(Wallet)
  private readonly walletRepository: Repository<Wallet>;
  @InjectRepository(WalletActivityLog)
  private readonly activityLogRepository: Repository<WalletActivityLog>;
  private transactionSvc: TransactionServiceClient;

  @Inject(TRANSACTION_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.transactionSvc = this.client.getService<TransactionServiceClient>(
      TRANSACTION_SERVICE_NAME,
    );
  }

  public async createWallet(
    payload: CreateWalletDto,
  ): Promise<NewWalletResponse> {
    const accountNumber = this.generateAccountNumber(payload.userId);

    await this.walletRepository
      .create({
        ...payload,
        accountNumber,
        balance: 0,
      })
      .save();

      const response = {
        status: HttpStatus.CREATED,
        message: 'Wallet has been created!',
        accountNumber,
      };

    return response;
  }

  public async findWallet(payload: FindWalletDto): Promise<FindWalletResponse> {
    const foundWallet = await this.walletRepository.findOne({
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
      data: foundWallet
    };
  }

  public async getWallets(payload: GetWalletsDto): Promise<GetWalletsResponse> {
    const wallets = await this.walletRepository.find({
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
    const foundTransaction = await firstValueFrom(
      this.transactionSvc.validateTransaction({
        transactionId: data.transactionId,
      }),
    );

    if (foundTransaction.status !== HttpStatus.OK) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid transaction',
      };
    }

    const wallet = await this.walletRepository.findOne({
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

    if (wallet.balance < data.amount) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Insufficient balance to perform this operation',
      };
    }

    const similarActivity = await this.activityLogRepository.findOne({
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
      await this.walletRepository.update(
        { id: wallet.id },
        { balance: wallet.balance - data.amount },
      );
      await this.activityLogRepository
        .create({
          walletId: wallet.id,
          amount: data.amount,
          action: 'DEBIT',
          transactionId: data.transactionId,
        })
        .save();

      return {
        status: HttpStatus.OK,
        message: 'Withdrawal is successful!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
      };
    }
  }

  public async depositMoney(
    data: DepositMoneyDto,
  ): Promise<DepositMoneyResponse> {
    const foundTransaction = await firstValueFrom(
      this.transactionSvc.validateTransaction({
        transactionId: data.transactionId,
      }),
    );

    if (foundTransaction.status !== HttpStatus.OK) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid transaction',
      };
    }

    const wallet = await this.walletRepository.findOne({
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

    const similarOperation = await this.activityLogRepository.findOne({
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
      const newBalance = parseFloat(wallet.balance.toString()) + data.amount;

      await this.walletRepository
        .createQueryBuilder()
        .update(Wallet)
        .set({ balance: newBalance })
        .where('id=:id', { id: wallet.id })
        .execute();
      await this.activityLogRepository
        .create({
          walletId: wallet.id,
          amount: data.amount,
          action: 'CREDIT',
          transactionId: data.transactionId,
        })
        .save();

      return {
        status: HttpStatus.OK,
        message: 'Deposit is successful!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
      };
    }
  }

  public async topUp(data: TopUpDto): Promise<TopupMoneyResponse> {
    const foundWallet = await this.walletRepository.findOne({
      where: {
        accountNumber: data.accountNumber,
      },
    });

    if (!foundWallet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Wallet not found',
      };
    }

    const newBalance = parseFloat(foundWallet.balance.toString()) + data.amount;

    await this.walletRepository
      .createQueryBuilder()
      .update(Wallet)
      .set({ balance: newBalance })
      .where('id=:id', { id: foundWallet.id })
      .execute();

    return {
      status: HttpStatus.OK,
      message: 'Wallet topup complete!',
    };
  }

  public async getActivityLog(
    data: WalletActivityLogsDto,
  ): Promise<ActivityLogResponse> {
    const offset = data.limit * (data.page - 1);

    const foundWallet = await this.walletRepository.findOne({
      where: {
        accountNumber: data.accountNumber,
      },
    });

    if (!foundWallet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Wallet not found',
        data: null,
        meta: null,
      };
    }

    const activityLogs = await this.activityLogRepository.find({
      where: {
        walletId: foundWallet.id,
      },
      skip: offset,
      take: data.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      status: HttpStatus.OK,
      message: null,
      data: activityLogs,
      meta: {
        page: data.page,
        pages: Math.ceil(activityLogs.length / data.limit),
        total: activityLogs.length,
      },
    };
  }

  private generateAccountNumber(userId: number): string {
    return `200-${userId.toString()}-${Number(Date.now()).toString()}`;
  }
}
