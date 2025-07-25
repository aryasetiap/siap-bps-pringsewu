<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'deskripsi',
        'satuan',
        'stok',
        'ambang_batas_kritis',
        'status_aktif',
    ];
}
