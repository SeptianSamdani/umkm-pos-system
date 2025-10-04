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
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            
            // Snapshot data produk saat transaksi
            $table->string('product_name');
            $table->string('product_sku');
            
            $table->integer('qty');
            $table->decimal('price', 15, 2)->comment('Harga jual saat transaksi');
            $table->decimal('discount', 15, 2)->default(0)->comment('Diskon per item');
            $table->decimal('subtotal', 15, 2);
            
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index(['sale_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
