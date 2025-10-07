<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockLog;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display POS interface
     */
    public function index()
    {
        // Get all active products with stock
        $allProducts = Product::with('category', 'supplier')
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->get();

        // Group by category name for easier access
        $products = $allProducts->groupBy(function($product) {
            return $product->category ? $product->category->name : 'Uncategorized';
        });

        // Get categories with product count
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function($query) {
                $query->where('is_active', true)->where('stock', '>', 0);
            }])
            ->having('products_count', '>', 0)
            ->get();

        // Get recent customers
        $customers = Customer::where('is_active', true)
            ->latest()
            ->limit(50) // Increase limit for better UX
            ->get(['id', 'name', 'phone', 'email']); // Only needed fields

        return Inertia::render('POS/Index', [
            'products' => $products,
            'categories' => $categories,
            'customers' => $customers,
        ]);
    }

    /**
     * Search products (for barcode scanner / search)
     */
    public function searchProducts(Request $request)
    {
        $query = Product::with('category')
            ->where('is_active', true)
            ->where('stock', '>', 0);

        if ($request->q) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->q}%")
                  ->orWhere('sku', 'like', "%{$request->q}%")
                  ->orWhere('barcode', $request->q);
            });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->limit(20)->get());
    }

    /**
     * Get product by barcode (for scanner)
     */
    public function getByBarcode($barcode)
    {
        $product = Product::with('category')
            ->where('barcode', $barcode)
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found or out of stock'
            ], 404);
        }

        return response()->json($product);
    }

    /**
     * Create sale from POS
     */
    public function createSale(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'payment_method' => 'required|in:cash,debit,credit,qris,transfer',
            'payment_reference' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'cash_received' => 'required_if:payment_method,cash|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        try {
            $sale = DB::transaction(function () use ($validated, $request) {
                // Calculate totals
                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $itemDiscount = $item['discount'] ?? 0;
                    $subtotal += ($item['price'] * $item['qty']) - $itemDiscount;
                }

                $discount = $validated['discount'] ?? 0;
                $taxRate = $validated['tax_rate'] ?? 11; // Default 11% PPN
                $tax = ($subtotal - $discount) * ($taxRate / 100);
                $total = $subtotal - $discount + $tax;
                
                $cashReceived = $validated['payment_method'] === 'cash' 
                    ? ($validated['cash_received'] ?? $total) 
                    : $total;
                $change = max(0, $cashReceived - $total);

                // Generate invoice
                $lastSale = Sale::whereDate('created_at', today())->latest()->first();
                $number = $lastSale ? intval(substr($lastSale->invoice, -4)) + 1 : 1;
                $invoice = 'INV-' . now()->format('Ymd') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);

                // ✅ FIXED: Safe access to optional fields
                $sale = Sale::create([
                    'invoice' => $invoice,
                    'user_id' => auth()->id(),
                    'customer_id' => $request->input('customer_id'), // ✅ Null-safe
                    'sale_date' => now(),
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'discount' => $discount,
                    'total' => $total,
                    'payment_method' => $validated['payment_method'],
                    'cash_received' => $cashReceived,
                    'change' => $change,
                    'payment_reference' => $request->input('payment_reference'), // ✅ Null-safe
                    'status' => 'completed',
                    'note' => $request->input('note'), // ✅ Null-safe
                ]);

                // Create sale items & update stock
                foreach ($validated['items'] as $item) {
                    $product = Product::findOrFail($item['product_id']);

                    // Check stock availability
                    if ($product->stock < $item['qty']) {
                        throw new \Exception("Insufficient stock for {$product->name}. Available: {$product->stock}");
                    }

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'qty' => $item['qty'],
                        'price' => $item['price'],
                        'discount' => $item['discount'] ?? 0,
                        'subtotal' => ($item['price'] * $item['qty']) - ($item['discount'] ?? 0),
                    ]);

                    // Update stock
                    $stockBefore = $product->stock;
                    $product->decrement('stock', $item['qty']);
                    $product->refresh();

                    // Log stock
                    StockLog::create([
                        'product_id' => $product->id,
                        'user_id' => auth()->id(),
                        'type' => 'out',
                        'qty' => -$item['qty'],
                        'stock_before' => $stockBefore,
                        'stock_after' => $product->stock,
                        'reference_type' => 'sale',
                        'reference_id' => $sale->id,
                        'note' => "POS Sale {$invoice}",
                        'logged_at' => now(),
                    ]);
                }

                return $sale;
            });

            return response()->json([
                'success' => true,
                'message' => 'Sale created successfully',
                'data' => $sale->load(['items.product', 'customer']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Quick add customer from POS
     */
    public function quickAddCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15|unique:customers,phone',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }

    /**
     * Get today's sales summary (for POS header)
     */
    public function getTodaySummary()
    {
        $today = Sale::whereDate('sale_date', today())
            ->where('status', 'completed')
            ->selectRaw('COUNT(*) as transactions, SUM(total) as total_sales')
            ->first();

        return response()->json([
            'transactions' => $today->transactions ?? 0,
            'total_sales' => $today->total_sales ?? 0,
        ]);
    }

    /**
     * Print receipt (return receipt data)
     */
    public function printReceipt(Sale $sale)
    {
        $sale->load(['items.product', 'customer', 'user']);
        
        // Update print count
        $sale->increment('print_count');

        return response()->json([
            'sale' => $sale,
            'company' => [
                'name' => config('app.name', 'POS System'),
                'address' => 'Jakarta, Indonesia', // From settings
                'phone' => '021-12345678',
            ],
        ]);
    }
}