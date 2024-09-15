import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Wallet } from "./wallet.entity";

@Entity("wallet_activity_logs")
export class WalletActivityLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'integer' })
    public transactionId!: number;

    @Column({ type: 'integer' })
    public walletId!: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    public amount!: number;

    @Column('enum', {
        name: 'action',
        nullable: false,
        enum: ['DEBIT', 'CREDIT']
    })
    public action!: 'DEBIT' | 'CREDIT';

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
   deletedAt: Date;

    @ManyToOne(()=> Wallet, (wallet)=> wallet.activityLogs)
    public wallet: Wallet;
}