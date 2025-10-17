<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockLogController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes - Core System
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Categories
    Route::middleware('can:view products')->group(function () {
        Route::resource('categories', CategoryController::class);
    });

    // Suppliers
    Route::middleware('can:view suppliers')->group(function () {
        Route::resource('suppliers', SupplierController::class);
    });

    // Products
    Route::middleware('can:view products')->group(function () {
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
        Route::get('products/create', [ProductController::class, 'create'])
            ->middleware('can:create products')
            ->name('products.create');
        Route::post('products', [ProductController::class, 'store'])
            ->middleware('can:create products')
            ->name('products.store');
        Route::get('products/{product}/edit', [ProductController::class, 'edit'])
            ->middleware('can:edit products')
            ->name('products.edit');
        Route::put('products/{product}', [ProductController::class, 'update'])
            ->middleware('can:edit products')
            ->name('products.update');
        Route::delete('products/{product}', [ProductController::class, 'destroy'])
            ->middleware('can:delete products')
            ->name('products.destroy');
    });

    // Customers
    Route::middleware('can:view customers')->group(function () {
        Route::resource('customers', CustomerController::class);
    });

    // Sales
    Route::middleware('can:view sales')->group(function () {
        Route::get('sales', [SaleController::class, 'index'])->name('sales.index');
        Route::get('sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    });
    
    Route::middleware('can:create sales')->group(function () {
        Route::get('sales/create', [SaleController::class, 'create'])->name('sales.create');
        Route::post('sales', [SaleController::class, 'store'])->name('sales.store');
    });

    // Purchases
    Route::middleware('can:view purchases')->group(function () {
        Route::get('purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::get('purchases/{purchase}', [PurchaseController::class, 'show'])->name('purchases.show');
    });
    
    Route::middleware('can:create purchases')->group(function () {
        Route::get('purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
        Route::post('purchases', [PurchaseController::class, 'store'])->name('purchases.store');
    });
    
    Route::middleware('can:receive purchases')->group(function () {
        Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])
            ->name('purchases.receive');
    });

    // Stock Logs
    Route::middleware('can:view stock logs')->group(function () {
        Route::get('stock-logs', [StockLogController::class, 'index'])->name('stock-logs.index');
    });

    // POS Interface (Cashier)
    Route::middleware('can:create sales')->group(function () {
        Route::get('pos', [PosController::class, 'index'])->name('pos.index');
        Route::post('pos/sale', [PosController::class, 'createSale'])->name('pos.sale');
        Route::post('pos/customer', [PosController::class, 'quickAddCustomer'])->name('pos.customer');
    });

    // User Management (only for users with 'manage users' permission)
    Route::middleware('can:manage users')->group(function () {
        Route::resource('users', UserController::class);
    });

    // Role Management (only for owner)
    Route::middleware('role:owner')->group(function () {
        Route::resource('roles', RoleController::class);
    });
});

require __DIR__.'/auth.php';