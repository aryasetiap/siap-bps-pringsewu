import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFotoToBarang1753434659279 implements MigrationInterface {
    name = 'AddFotoToBarang1753434659279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barang" ADD "foto" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "barang" DROP COLUMN "foto"`);
    }

}
