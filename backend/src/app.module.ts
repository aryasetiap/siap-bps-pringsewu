import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BarangModule } from './barang/barang.module';
import { PermintaanModule } from './permintaan/permintaan.module';

/**
 * AppModule adalah modul utama aplikasi.
 *
 * Modul ini bertanggung jawab untuk menginisialisasi dan mengatur seluruh modul lain,
 * konfigurasi environment, serta koneksi database.
 *
 * @module AppModule
 */
@Module({
  imports: [
    /**
     * Menginisialisasi modul konfigurasi global.
     */
    ConfigModule.forRoot({ isGlobal: true }),

    /**
     * Mengatur koneksi ke database PostgreSQL menggunakan TypeORM.
     * Parameter diambil dari environment variable.
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Ubah ke false pada production
    }),

    /**
     * Modul-modul fitur aplikasi.
     */
    AuthModule,
    UserModule,
    BarangModule,
    PermintaanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
