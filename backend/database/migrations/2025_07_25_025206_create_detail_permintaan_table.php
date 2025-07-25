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
        Schema::create('detail_permintaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_permintaan')->constrained('permintaan')->onDelete('cascade');
            $table->foreignId('id_barang')->constrained('barang');
            $table->integer('jumlah_diminta');
            $table->integer('jumlah_disetujui')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_permintaan');
    }
};
