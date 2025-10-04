<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\StockLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'user']);

        if ($request->search) {
            $query->where('invoice', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $purchases = $query->latest('purchase_date')->paginate(10)->withQueryString();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $suppliers = Supplier::where('is_active', true)->get();
        $products = Product::where('is_active', true)->get();

        return Inertia::render('Purchases/Create', [
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.cost' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // Calculate total
            $total = 0;
            foreach ($validated['items'] as $item) {
                $total += $item['cost'] * $item['qty'];
            }

            // Generate invoice
            $lastPurchase = Purchase::whereDate('created_at', today())->latest()->first();
            $number = $lastPurchase ? intval(substr($lastPurchase->invoice, -4)) + 1 : 1;
            $invoice = 'PO-' . now()->format('Ymd') . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);

            // Create purchase
            $purchase = Purchase::create([
                'invoice' => $invoice,
                'supplier_id' => $validated['supplier_id'],
                'user_id' => auth()->id(),
                'purchase_date' => $validated['purchase_date'],
                'total' => $total,
                'status' => 'pending',
                'note' => $validated['note'],
            ]);

            // Create purchase items
            foreach ($validated['items'] as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'cost' => $item['cost'],
                    'subtotal' => $item['cost'] * $item['qty'],
                ]);
            }
        });

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase created successfully.');
    }

    public function show(Purchase $purchase)
    {
        $purchase->load(['supplier', 'user', 'items.product']);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase,
        ]);
    }

    public function receive(Purchase $purchase)
    {
        if ($purchase->status !== 'pending') {
            return back()->with('error', 'Purchase already received or cancelled.');
        }

        DB::transaction(function () use ($purchase) {
            // Update stock for each item
            foreach ($purchase->items as $item) {
                $product = $item->product;
                $stockBefore = $product->stock;
                
                $product->increment('stock', $item->qty);
                $product->refresh();

                // Log stock
                StockLog::create([
                    'product_id' => $product->id,
                    'user_id' => auth()->id(),
                    'type' => 'in',
                    'qty' => $item->qty,
                    'stock_before' => $stockBefore,
                    'stock_after' => $product->stock,
                    'reference_type' => 'purchase',
                    'reference_id' => $purchase->id,
                    'note' => "Purchase {$purchase->invoice}",
                    'logged_at' => now(),
                ]);
            }

            // Update purchase status
            $purchase->update([
                'status' => 'received',
                'received_at' => now(),
            ]);
        });

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Purchase received successfully.');
    }
}