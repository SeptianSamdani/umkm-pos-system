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
        Schema::create('stock_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->enum('type', ['in', 'out', 'adjustment'])->comment('in=restock, out=sale, adjustment=koreksi');
            $table->integer('qty')->comment('Jumlah perubahan (bisa negatif)');
            $table->integer('stock_before');
            $table->integer('stock_after');
            
            $table->string('reference_type')->nullable()->comment('sale, purchase, adjustment');
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('note')->nullable();
            
            $table->timestamp('logged_at');
            $table->timestamps();

            $table->index(['product_id', 'logged_at']);
            $table->index(['reference_type', 'reference_id']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_logs');
    }
};
