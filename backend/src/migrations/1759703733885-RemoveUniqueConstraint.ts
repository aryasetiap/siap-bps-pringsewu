import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueConstraint1759703733885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cek dulu apakah constraint masih ada
    const constraints = await queryRunner.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'barang' 
      AND constraint_type = 'UNIQUE' 
      AND constraint_name LIKE '%kode_barang%'
    `);

    // Hapus constraint jika ada
    for (const constraint of constraints) {
      await queryRunner.query(
        `ALTER TABLE "barang" DROP CONSTRAINT "${constraint.constraint_name}"`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Tambahkan kembali unique constraint
    await queryRunner.query(
      `ALTER TABLE "barang" ADD CONSTRAINT "UQ_kode_barang_unique" UNIQUE ("kode_barang")`,
    );
  }
}
