<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Barang;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Barang::create([
            'kode_barang' => 'ATK001',
            'nama_barang' => 'Pulpen',
            'deskripsi' => 'Pulpen tinta biru',
            'satuan' => 'pcs',
            'stok' => 100,
            'ambang_batas_kritis' => 10,
            'status_aktif' => true,
        ]);

        Barang::create([
            'kode_barang' => 'ATK002',
            'nama_barang' => 'Buku Tulis',
            'deskripsi' => 'Buku tulis 40 lembar',
            'satuan' => 'pcs',
            'stok' => 50,
            'ambang_batas_kritis' => 5,
            'status_aktif' => true,
        ]);
    }
}
