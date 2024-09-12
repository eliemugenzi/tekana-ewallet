import { HttpStatus, Injectable } from '@nestjs/common';
import { Wallet } from '@prisma/client'
import { DatabaseService } from '../database/database.service';
import { CreateWalletDto, FindWalletDto, GetWalletsDto } from './wallet.dto';
import { FindWalletResponse, GetWalletsResponse, NewWalletResponse } from './wallet.pb';

@Injectable()
export class WalletService {
    constructor(private readonly db: DatabaseService) {}

    public async createWallet(payload: CreateWalletDto): Promise<NewWalletResponse> {

        const accountNumber = this.generateAccountNumber(payload.userId);
    
       await this.db.wallet.create({
         data: {
            ...payload,
            accountNumber,
         }
       })

       return {
        status: HttpStatus.CREATED,
        message: 'Wallet has been created!'
       }

    }

    public async findWallet(payload: FindWalletDto): Promise<FindWalletResponse> {
     const foundWallet = await this.db.wallet.findFirst({
        where: {
            accountNumber: payload.accountNumber
        },
        select: {
            id: true,
            accountNumber: true,
            userId: true,
            type: true,
            balance: true,
            activityLogs: true
        }
     })

     if(!foundWallet) {
        return {
            status: HttpStatus.NOT_FOUND,
            message: 'Wallet not found',
            data: null
        }
     }


     return {
        status: HttpStatus.OK,
        message: 'Wallet retrieved',
        data: foundWallet
     }
    }

    public async getWallets(payload: GetWalletsDto): Promise<GetWalletsResponse> {
        const wallets = await this.db.wallet.findMany({
            where: {
                userId: payload.userId
            },
            select: {
                id: true,
                accountNumber: true,
                userId: true,
                type: true,
                balance: true,
                activityLogs: true
            }
        })

        return {
            status: HttpStatus.OK,
            message: null,
            data: wallets,
        }
    }

    private generateAccountNumber(userId: number): string {
      return `200-${userId.toString()}-${Number(Date.now()).toString()}`
    }
}
