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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('sale_date');
            
            // Amounts
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0)->comment('PPN 11%');
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            
            // Payment
            $table->enum('payment_method', ['cash', 'debit', 'credit', 'qris', 'transfer'])->default('cash');
            $table->decimal('cash_received', 15, 2)->default(0);
            $table->decimal('change', 15, 2)->default(0);
            $table->string('payment_reference')->nullable()->comment('Untuk QRIS/Transfer');
            
            // Status & Notes
            $table->enum('status', ['completed', 'cancelled'])->default('completed');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'sale_date']);
            $table->index('invoice');
            $table->index('sale_date');
            $table->index('status');
            $table->index(['sale_date', 'status']);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
