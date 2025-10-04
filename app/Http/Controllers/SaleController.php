<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\Customer;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['user', 'customer']);

        if ($request->search) {
            $query->where('invoice', 'like', "%{$request->search}%");
        }

        if ($request->date_from) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }

        $sales = $query->latest('sale_date')->paginate(10)->withQueryString();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function create()
    {
        $products = Product::with('category')
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->get();

        $customers = Customer::where('is_active', true)->get();

        return Inertia::render('Sales/Create', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
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
            'cash_received' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $itemDiscount = $item['discount'] ?? 0;
                $subtotal += ($item['price'] * $item['qty']) - $itemDiscount;
            }

            $discount = $validated['discount'] ?? 0;
            $tax = ($subtotal - $discount) * 0.11; // 11% PPN
            $total = $subtotal - $discount + $tax;
            $change = $validated['cash_received'] - $total;

            // Generate invoice
            $lastSale = Sale::whereDate('created_at', today())->latest()->first();
            $number = $lastSale ? intval(substr($lastSale->invoice, -4)) + 1 : 1;
            $invoice = 'INV-' . now()->format('Ymd') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);

            // Create sale
            $sale = Sale::create([
                'invoice' => $invoice,
                'user_id' => auth()->id(),
                'customer_id' => $validated['customer_id'],
                'sale_date' => now(),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'cash_received' => $validated['cash_received'],
                'change' => $change,
                'payment_reference' => $validated['payment_reference'],
                'status' => 'completed',
                'note' => $validated['note'],
            ]);

            // Create sale items & update stock
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

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
                    'note' => "Sale {$invoice}",
                    'logged_at' => now(),
                ]);
            }
        });

        return redirect()->route('sales.index')
            ->with('success', 'Sale created successfully.');
    }

    public function show(Sale $sale)
    {
        $sale->load(['user', 'customer', 'items.product']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }
}