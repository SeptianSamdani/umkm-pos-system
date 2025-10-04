<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TaxController;
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
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes - Core System
|--------------------------------------------------------------------------
*/
// Route::middleware('auth')->group(function () {
    
//     // Dashboard
//     Route::get('/dashboard', DashboardController::class)->name('dashboard');
    
//     // Profile
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
//     // Core Resources - Simple CRUD
//     Route::resource('products', ProductController::class);
//     Route::resource('categories', CategoryController::class);
//     Route::resource('customers', CustomerController::class);
//     Route::resource('suppliers', SupplierController::class);
//     Route::resource('payment-methods', PaymentMethodController::class);
//     Route::resource('taxes', TaxController::class);
//     Route::resource('users', UserController::class);
//     Route::resource('roles', RoleController::class);
    
//     // Sales & POS
//     Route::resource('sales', SaleController::class)->only(['index', 'create', 'store', 'show']);
//     Route::post('sales/{sale}/refund', [SaleController::class, 'refund'])->name('sales.refund');
//     Route::get('sales/{sale}/receipt', [SaleController::class, 'printReceipt'])->name('sales.receipt');
    
//     // Purchases
//     Route::resource('purchases', PurchaseController::class);
//     Route::post('purchases/{purchase}/receive', [PurchaseController::class, 'receive'])->name('purchases.receive');
    
//     // Stock Movements
//     Route::resource('stock-movements', StockMovementController::class);
    
//     /*
//     |--------------------------------------------------------------------------
//     | API Routes for AJAX/Frontend
//     |--------------------------------------------------------------------------
//     */
//     Route::prefix('api')->group(function () {
//         // Sales API
//         Route::get('sales/summary', [SaleController::class, 'summary']);
//         Route::get('sales/product-search', [SaleController::class, 'getProduct']);
//         Route::post('sales/quick-sale', [SaleController::class, 'quickSale']);
        
//         // Payment Methods API
//         Route::get('payment-methods/active', [PaymentMethodController::class, 'getActive']);
//         Route::post('payment-methods/{paymentMethod}/calculate-fee', [PaymentMethodController::class, 'calculateFee']);
        
//         // Tax API
//         Route::get('taxes/active', [TaxController::class, 'getActive']);
//         Route::post('taxes/{tax}/calculate', [TaxController::class, 'calculate']);
        
//         // Product API
//         Route::get('products/low-stock', [ProductController::class, 'getLowStock']);
//         Route::get('products/search', [ProductController::class, 'search']);
//     });
    
//     /*
//     |--------------------------------------------------------------------------
//     | Quick Actions (Status Updates)
//     |--------------------------------------------------------------------------
//     */
//     Route::prefix('actions')->group(function () {
//         // Toggle Status Actions
//         Route::patch('payment-methods/{paymentMethod}/toggle', [PaymentMethodController::class, 'toggleStatus'])->name('payment-methods.toggle');
//         Route::patch('taxes/{tax}/toggle', [TaxController::class, 'toggleStatus'])->name('taxes.toggle');
//         Route::patch('products/{product}/toggle', [ProductController::class, 'toggleStatus'])->name('products.toggle');
        
//         // Order Updates
//         Route::patch('payment-methods/reorder', [PaymentMethodController::class, 'updateOrder'])->name('payment-methods.reorder');
//         Route::patch('categories/reorder', [CategoryController::class, 'updateOrder'])->name('categories.reorder');
//     });
// });

require __DIR__.'/auth.php';