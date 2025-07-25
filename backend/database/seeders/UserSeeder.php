<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin SIAP',
            'username' => 'admin',
            'email' => 'admin@bps.go.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'unit_kerja' => 'BPS Pringsewu',
            'status_aktif' => true,
        ]);

        User::create([
            'name' => 'Pegawai Satu',
            'username' => 'pegawai1',
            'email' => 'pegawai1@bps.go.id',
            'password' => Hash::make('pegawai123'),
            'role' => 'pegawai',
            'unit_kerja' => 'BPS Pringsewu',
            'status_aktif' => true,
        ]);
    }
}
