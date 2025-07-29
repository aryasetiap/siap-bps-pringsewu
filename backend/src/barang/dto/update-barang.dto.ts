import { PartialType } from '@nestjs/mapped-types';
import { CreateBarangDto } from './create-barang.dto';

/**
 * DTO untuk memperbarui data Barang.
 *
 * Kelas ini mewarisi sebagian properti dari `CreateBarangDto` secara opsional,
 * sehingga dapat digunakan untuk melakukan pembaruan parsial pada entitas Barang.
 */
export class UpdateBarangDto extends PartialType(CreateBarangDto) {}
