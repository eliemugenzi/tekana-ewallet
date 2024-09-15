import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('transactions')
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
  public id!: number;
  @Column({type: 'varchar'})
  public senderAccountNumber!: string;
  @Column({ type: 'varchar' })
  public receiverAccountNumber!: string;

  @Column({ type: 'integer' })
  public userId!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public amount!: number;

  @Column('enum', {
    name: 'status',
    nullable: false,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING'
  })
  public status!: 'PENDING' | 'SUCCESS' | 'FAILED';

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}