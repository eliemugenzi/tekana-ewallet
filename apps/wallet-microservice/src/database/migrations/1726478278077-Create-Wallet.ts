import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWallet1726478278077 implements MigrationInterface {
    name = 'CreateWallet1726478278077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."wallet_activity_logs_action_enum" AS ENUM('DEBIT', 'CREDIT')`);
        await queryRunner.query(`CREATE TABLE "wallet_activity_logs" ("id" SERIAL NOT NULL, "transactionId" integer NOT NULL, "walletId" integer NOT NULL, "amount" numeric(15,2) NOT NULL DEFAULT '0', "action" "public"."wallet_activity_logs_action_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_010894a4c987e122c2ed550173f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallets_type_enum" AS ENUM('SAVING', 'PERSONAL', 'LOAN')`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "accountNumber" character varying NOT NULL, "type" "public"."wallets_type_enum" NOT NULL DEFAULT 'PERSONAL', "balance" numeric(15,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "UQ_444a7f9feac3d2154c45875d0a1" UNIQUE ("accountNumber"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wallet_activity_logs" ADD CONSTRAINT "FK_dcb09e0584abf103a9a10b711bb" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_activity_logs" DROP CONSTRAINT "FK_dcb09e0584abf103a9a10b711bb"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TYPE "public"."wallets_type_enum"`);
        await queryRunner.query(`DROP TABLE "wallet_activity_logs"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_activity_logs_action_enum"`);
    }

}
