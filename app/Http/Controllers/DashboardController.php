<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // Cache dashboard stats for 5 minutes
        $stats = Cache::remember('dashboard.stats.' . today()->toDateString(), 300, function () {
            return $this->getDashboardStats();
        });

        $recentSales = Sale::with(['user:id,name', 'customer:id,name'])
            ->select(['id', 'invoice', 'user_id', 'customer_id', 'total', 'sale_date', 'status'])
            ->where('status', 'completed')
            ->latest('sale_date')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_sales' => $recentSales,
        ]);
    }

    private function getDashboardStats(): array
    {
        $today = today();

        // Today's sales
        $todaySales = Sale::whereDate('sale_date', $today)
            ->where('status', 'completed')
            ->sum('total') ?? 0;

        // Today's transactions
        $todayTransactions = Sale::whereDate('sale_date', $today)
            ->where('status', 'completed')
            ->count();

        // Low stock products
        $lowStockProducts = Product::where('is_active', true)
            ->whereColumn('stock', '<=', 'min_stock')
            ->count();

        // Total active products
        $totalProducts = Product::where('is_active', true)->count();

        // This week comparison
        $weekStart = now()->startOfWeek();
        $weekEnd = now()->endOfWeek();
        $lastWeekStart = now()->subWeek()->startOfWeek();
        $lastWeekEnd = now()->subWeek()->endOfWeek();

        $thisWeekSales = Sale::whereBetween('sale_date', [$weekStart, $weekEnd])
            ->where('status', 'completed')
            ->sum('total') ?? 0;

        $lastWeekSales = Sale::whereBetween('sale_date', [$lastWeekStart, $lastWeekEnd])
            ->where('status', 'completed')
            ->sum('total') ?? 0;

        $salesGrowth = $lastWeekSales > 0 
            ? (($thisWeekSales - $lastWeekSales) / $lastWeekSales) * 100 
            : 0;

        // Top selling products this month
        $topProducts = DB::table('sale_items')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->whereMonth('sales.sale_date', now()->month)
            ->whereYear('sales.sale_date', now()->year)
            ->where('sales.status', 'completed')
            ->select(
                'products.name',
                DB::raw('SUM(sale_items.qty) as total_qty'),
                DB::raw('SUM(sale_items.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        return [
            'today_sales' => (float) $todaySales,
            'today_transactions' => $todayTransactions,
            'low_stock_products' => $lowStockProducts,
            'total_products' => $totalProducts,
            'sales_growth' => round($salesGrowth, 1),
            'this_week_sales' => (float) $thisWeekSales,
            'last_week_sales' => (float) $lastWeekSales,
            'top_products' => $topProducts,
        ];
    }
}