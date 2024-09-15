import { Exclude } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
 public id!: number;

 @Column({type: 'varchar', unique: true, length: 50})
 public email!: string;

 @Column({ type: 'varchar', length: 50 })
 public fullName!: string;

 @Column({
    type: 'varchar',
    length: 50
 })
 public nationalId: string;

 @Column('enum', {
    name: 'gender',
    nullable: false,
    enum: ['M', 'F'],
    default: 'M'
 })
 public gender: 'M' | 'F';
 @Exclude()
 @Column({ type: 'varchar', length: 100 })
 public password: string;

 @Column()
 @CreateDateColumn()
 createdAt: Date;

 @Column()
 @UpdateDateColumn()
 updatedAt: Date;
}