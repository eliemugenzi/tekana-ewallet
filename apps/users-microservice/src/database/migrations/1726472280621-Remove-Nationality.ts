import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNationality1726472280621 implements MigrationInterface {
    name = 'RemoveNationality1726472280621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nationality"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "nationality" character varying`);
    }

}
