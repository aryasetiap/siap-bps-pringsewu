import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1753425078885 implements MigrationInterface {
    name = 'InitSchema1753425078885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "nama" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'pegawai', "unit_kerja" character varying, "status_aktif" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permintaan" ("id" SERIAL NOT NULL, "id_user_pemohon" integer NOT NULL, "tanggal_permintaan" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'Menunggu', "catatan_admin" character varying, "id_user_verifikator" integer, "tanggal_verifikasi" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f1609a94759c3c98a3cae6d05f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barang" ("id" SERIAL NOT NULL, "kode_barang" character varying NOT NULL, "nama_barang" character varying NOT NULL, "deskripsi" character varying, "satuan" character varying NOT NULL, "stok" integer NOT NULL DEFAULT '0', "ambang_batas_kritis" integer NOT NULL DEFAULT '0', "status_aktif" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6c40adc0693a8a4ca92dc4cf7b1" UNIQUE ("kode_barang"), CONSTRAINT "PK_f72eb4a0ebce770648bd746560f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detail_permintaan" ("id" SERIAL NOT NULL, "id_permintaan" integer NOT NULL, "id_barang" integer NOT NULL, "jumlah_diminta" integer NOT NULL, "jumlah_disetujui" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0c86b9e743c615c349a610364f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permintaan" ADD CONSTRAINT "FK_bd1c343425c23af99d74cd332a1" FOREIGN KEY ("id_user_pemohon") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detail_permintaan" ADD CONSTRAINT "FK_82c30de0c8a7976717b6fff08dc" FOREIGN KEY ("id_permintaan") REFERENCES "permintaan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detail_permintaan" ADD CONSTRAINT "FK_1dfc02c9dbdd72ae9bee94ee0ff" FOREIGN KEY ("id_barang") REFERENCES "barang"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "detail_permintaan" DROP CONSTRAINT "FK_1dfc02c9dbdd72ae9bee94ee0ff"`);
        await queryRunner.query(`ALTER TABLE "detail_permintaan" DROP CONSTRAINT "FK_82c30de0c8a7976717b6fff08dc"`);
        await queryRunner.query(`ALTER TABLE "permintaan" DROP CONSTRAINT "FK_bd1c343425c23af99d74cd332a1"`);
        await queryRunner.query(`DROP TABLE "detail_permintaan"`);
        await queryRunner.query(`DROP TABLE "barang"`);
        await queryRunner.query(`DROP TABLE "permintaan"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
