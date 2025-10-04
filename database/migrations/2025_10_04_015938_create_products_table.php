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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->decimal('cost', 15, 2)->default(0)->comment('Harga beli');
            $table->decimal('price', 15, 2)->default(0)->comment('Harga jual');
            $table->integer('stock')->default(0);
            $table->string('unit', 20)->default('pcs');
            $table->integer('min_stock')->default(5)->comment('Alert jika stock <= nilai ini');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['name', 'is_active']);
            $table->index('sku');
            $table->index('barcode');
            $table->index(['category_id', 'is_active']);
            $table->index(['supplier_id', 'is_active']);
            $table->index('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
