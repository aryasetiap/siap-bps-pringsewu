<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('permintaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user_pemohon')->constrained('users');
            $table->dateTime('tanggal_permintaan');
            $table->enum('status', ['Menunggu', 'Disetujui', 'Disetujui Sebagian', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_admin')->nullable();
            $table->foreignId('id_user_verifikator')->nullable()->constrained('users');
            $table->dateTime('tanggal_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permintaan');
    }
};
