<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $todaySales = Sale::whereDate('sale_date', today())
            ->where('status', 'completed')
            ->sum('total');

        $todayTransactions = Sale::whereDate('sale_date', today())
            ->where('status', 'completed')
            ->count();

        $lowStockProducts = Product::where('is_active', true)
            ->whereColumn('stock', '<=', 'min_stock')
            ->count();

        $totalProducts = Product::where('is_active', true)->count();

        $recentSales = Sale::with(['user', 'customer'])
            ->latest('sale_date')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'today_sales' => $todaySales,
                'today_transactions' => $todayTransactions,
                'low_stock_products' => $lowStockProducts,
                'total_products' => $totalProducts,
            ],
            'recent_sales' => $recentSales,
        ]);
    }
}