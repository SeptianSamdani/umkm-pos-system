<?php

// ========================================
// FILE: routes/api.php
// ========================================

use App\Http\Controllers\PosController;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Get authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ========================================
// POS API Routes
// ========================================
Route::middleware('auth:sanctum')->prefix('pos')->group(function () {
    
    // Product search (with filters)
    Route::get('products/search', [PosController::class, 'searchProducts']);
    
    // Get product by barcode (for scanner)
    Route::get('products/barcode/{barcode}', [PosController::class, 'getByBarcode']);
    
    // Today's sales summary
    Route::get('summary', [PosController::class, 'getTodaySummary']);
    
    // Receipt data
    Route::get('receipt/{sale}', [PosController::class, 'printReceipt']);
});

// ========================================
// General API Routes (for autocomplete, etc)
// ========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Product search (general)
    Route::get('products/search', function (Request $request) {
        $query = Product::with('category')
            ->where('is_active', true);

        if ($request->q) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%")
                  ->orWhere('sku', 'like', "%{$request->q}%")
                  ->orWhere('barcode', $request->q);
            });
        }

        return $query->limit(10)->get();
    });

    // Customer search
    Route::get('customers/search', function (Request $request) {
        $query = Customer::where('is_active', true);

        if ($request->q) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%")
                  ->orWhere('phone', 'like', "%{$request->q}%")
                  ->orWhere('email', 'like', "%{$request->q}%");
            });
        }

        return $query->limit(10)->get();
    });

    // Get product by ID (for quick view)
    Route::get('products/{product}', function (Product $product) {
        return $product->load(['category', 'supplier']);
    });

    // Check stock availability
    Route::get('products/{product}/stock', function (Product $product) {
        return response()->json([
            'available' => $product->stock > 0,
            'stock' => $product->stock,
            'low_stock' => $product->isLowStock(),
        ]);
    });
});