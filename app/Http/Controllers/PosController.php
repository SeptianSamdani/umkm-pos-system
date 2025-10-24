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
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        $allProducts = Product::with('category', 'supplier')
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->get();

        $products = $allProducts->groupBy(fn($product) => 
            $product->category ? $product->category->name : 'Uncategorized'
        );

        $categories = Category::where('is_active', true)
            ->withCount(['products' => fn($query) => 
                $query->where('is_active', true)->where('stock', '>', 0)
            ])
            ->having('products_count', '>', 0)
            ->get();

        $customers = Customer::where('is_active', true)
            ->latest()
            ->limit(50)
            ->get(['id', 'name', 'phone', 'email']);

        return Inertia::render('POS/Index', [
            'products' => $products,
            'categories' => $categories,
            'customers' => $customers,
        ]);
    }

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

    public function createSale(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'payment_method' => 'required|in:cash,debit,credit,qris,transfer',
            'payment_reference' => 'nullable|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'cash_received' => 'required_if:payment_method,cash|numeric|min:0',
            'note' => 'nullable|string|max:500',
        ]);

        try {
            $sale = DB::transaction(function () use ($validated) {
                // 1. Lock products dan validate stock
                $productIds = collect($validated['items'])->pluck('product_id');
                $products = Product::whereIn('id', $productIds)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                // 2. Calculate totals dan validate
                $subtotal = 0;
                $itemsData = [];

                foreach ($validated['items'] as $item) {
                    $product = $products->get($item['product_id']);
                    
                    if (!$product) {
                        throw new \Exception("Product ID {$item['product_id']} not found");
                    }

                    if ($product->stock < $item['qty']) {
                        throw new \Exception(
                            "Insufficient stock for {$product->name}. Available: {$product->stock}, Requested: {$item['qty']}"
                        );
                    }

                    $itemDiscount = $item['discount'] ?? 0;
                    $itemSubtotal = ($item['price'] * $item['qty']) - $itemDiscount;
                    $subtotal += $itemSubtotal;

                    $itemsData[] = [
                        'product' => $product,
                        'qty' => $item['qty'],
                        'price' => $item['price'],
                        'discount' => $itemDiscount,
                        'subtotal' => $itemSubtotal,
                    ];
                }

                // 3. Calculate final amounts
                $discount = $validated['discount'] ?? 0;
                $taxRate = $validated['tax_rate'] ?? 11;
                $tax = ($subtotal - $discount) * ($taxRate / 100);
                $total = $subtotal - $discount + $tax;
                
                $cashReceived = $validated['payment_method'] === 'cash' 
                    ? ($validated['cash_received'] ?? $total) 
                    : $total;
                
                // Validate sufficient cash
                if ($validated['payment_method'] === 'cash' && $cashReceived < $total) {
                    throw new \Exception("Insufficient cash. Required: " . number_format($total, 2));
                }
                
                $change = max(0, $cashReceived - $total);

                // 4. Generate unique invoice
                $invoice = $this->generateUniqueInvoice();

                // 5. Create sale
                $sale = Sale::create([
                    'invoice' => $invoice,
                    'user_id' => auth()->id(),
                    'customer_id' => $validated['customer_id'] ?? null,
                    'sale_date' => now(),
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'discount' => $discount,
                    'total' => $total,
                    'payment_method' => $validated['payment_method'],
                    'cash_received' => $cashReceived,
                    'change' => $change,
                    'payment_reference' => $validated['payment_reference'] ?? null,
                    'status' => 'completed',
                    'note' => $validated['note'] ?? null,
                ]);

                // 6. Create sale items & update stock
                foreach ($itemsData as $itemData) {
                    $product = $itemData['product'];

                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'qty' => $itemData['qty'],
                        'price' => $itemData['price'],
                        'discount' => $itemData['discount'],
                        'subtotal' => $itemData['subtotal'],
                    ]);

                    $stockBefore = $product->stock;
                    $product->decrement('stock', $itemData['qty']);
                    $product->refresh();

                    StockLog::create([
                        'product_id' => $product->id,
                        'user_id' => auth()->id(),
                        'type' => 'out',
                        'qty' => -$itemData['qty'],
                        'stock_before' => $stockBefore,
                        'stock_after' => $product->stock,
                        'reference_type' => 'sale',
                        'reference_id' => $sale->id,
                        'note' => "POS Sale {$invoice}",
                        'logged_at' => now(),
                    ]);
                }

                return $sale;
            }, 5); // 5 attempts for deadlock retry

            return response()->json([
                'success' => true,
                'message' => 'Sale created successfully',
                'data' => $sale->load(['items.product', 'customer', 'user']),
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '40001') {
                return response()->json([
                    'success' => false,
                    'message' => 'Transaction conflict. Please try again.',
                ], 409);
            }
            
            Log::error('POS Sale Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred. Please try again.',
            ], 500);
            
        } catch (\Exception $e) {
            Log::error('POS Sale Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function quickAddCustomer(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15|unique:customers,phone',
        ]);

        try {
            $customer = Customer::create($validated);

            return response()->json([
                'success' => true,
                'data' => $customer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create customer: ' . $e->getMessage(),
            ], 422);
        }
    }

    public function getTodaySummary()
    {
        $summary = Sale::whereDate('sale_date', today())
            ->where('status', 'completed')
            ->selectRaw('COUNT(*) as transactions, COALESCE(SUM(total), 0) as total_sales')
            ->first();

        return response()->json([
            'transactions' => $summary->transactions ?? 0,
            'total_sales' => $summary->total_sales ?? 0,
        ]);
    }

    public function printReceipt(Sale $sale)
    {
        $sale->load(['items.product', 'customer', 'user']);
        $sale->increment('print_count');

        return response()->json([
            'sale' => $sale,
            'company' => [
                'name' => config('app.name', 'POS System'),
                'address' => 'Jakarta, Indonesia',
                'phone' => '021-12345678',
            ],
        ]);
    }

    private function generateUniqueInvoice(int $attempt = 0): string
    {
        if ($attempt > 5) {
            throw new \Exception('Failed to generate unique invoice after 5 attempts');
        }

        $date = now()->format('Ymd');
        
        // Get last invoice today with lock
        $lastSale = Sale::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->lockForUpdate()
            ->first();
        
        $number = $lastSale 
            ? (int) substr($lastSale->invoice, -4) + 1 
            : 1;
            
        $invoice = 'INV-' . $date . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);

        // Double check uniqueness
        if (Sale::where('invoice', $invoice)->exists()) {
            return $this->generateUniqueInvoice($attempt + 1);
        }

        return $invoice;
    }
}