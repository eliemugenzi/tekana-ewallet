import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WalletActivityLog } from "./wallet-activity-log.entity";

@Entity("wallets")
export class Wallet extends BaseEntity {
   @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar', unique: true })
    public accountNumber!: string;

    @Column('enum', {  
        name: 'type',
        nullable: false,
        enum: ['SAVING', 'PERSONAL',  'LOAN'],
        default: 'PERSONAL'
    })
    public type!: 'SAVING' | 'LOAN' | 'PERSONAL';

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    public balance!: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    // Relation ID that comes from users microservice
    @Column({ type: 'integer' })
    public userId!: number;

    @OneToMany(()=> WalletActivityLog, (activityLog)=> activityLog.wallet)
    public activityLogs: WalletActivityLog[];
}