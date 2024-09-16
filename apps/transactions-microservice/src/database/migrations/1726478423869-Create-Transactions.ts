import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactions1726478423869 implements MigrationInterface {
    name = 'CreateTransactions1726478423869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'SUCCESS', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "senderAccountNumber" character varying NOT NULL, "receiverAccountNumber" character varying NOT NULL, "userId" integer NOT NULL, "amount" numeric(12,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    }

}
