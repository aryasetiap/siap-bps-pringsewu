import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFotoToUser1753434819049 implements MigrationInterface {
    name = 'AddFotoToUser1753434819049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "foto" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "foto"`);
    }

}
