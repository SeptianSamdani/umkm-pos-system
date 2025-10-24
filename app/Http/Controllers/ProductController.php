<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
                  ->orWhere('barcode', 'like', "%{$request->search}%");
            });
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->stock_status === 'low') {
            $query->whereColumn('stock', '<=', 'min_stock');
        } elseif ($request->stock_status === 'out') {
            $query->where('stock', 0);
        }

        $products = $query->latest()->paginate(15)->withQueryString();
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category_id', 'stock_status']),
        ]);
    }

    public function create()
    {
        $categories = Category::where('is_active', true)->get();
        $suppliers = Supplier::where('is_active', true)->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255|unique:products,sku',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'cost' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0|gte:cost',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'min_stock' => 'required|integer|min:0',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'boolean',
        ], [
            'price.gte' => 'Selling price must be greater than or equal to cost price',
            'image.max' => 'Image size must not exceed 2MB',
        ]);

        try {
            DB::beginTransaction();

            // Auto-generate SKU if empty
            if (empty($validated['sku'])) {
                $validated['sku'] = $this->generateUniqueSKU();
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('products', 'public');
            }

            Product::create($validated);

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up uploaded image if exists
            if (isset($validated['image'])) {
                Storage::disk('public')->delete($validated['image']);
            }

            Log::error('Product Creation Failed', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return back()
                ->withInput()
                ->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    public function show(Product $product)
    {
        $product->load(['category', 'supplier', 'stockLogs.user']);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)->get();
        $suppliers = Supplier::where('is_active', true)->get();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255|unique:products,sku,' . $product->id,
            'barcode' => 'nullable|string|max:255|unique:products,barcode,' . $product->id,
            'cost' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0|gte:cost',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'min_stock' => 'required|integer|min:0',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'boolean',
        ], [
            'price.gte' => 'Selling price must be greater than or equal to cost price',
            'image.max' => 'Image size must not exceed 2MB',
        ]);

        try {
            DB::beginTransaction();

            $oldImage = $product->image;

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
                $validated['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($validated);

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up new uploaded image if exists
            if (isset($validated['image']) && $validated['image'] !== $oldImage) {
                Storage::disk('public')->delete($validated['image']);
            }

            Log::error('Product Update Failed', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return back()
                ->withInput()
                ->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    public function destroy(Product $product)
    {
        try {
            // Check if product has been sold
            if ($product->saleItems()->exists()) {
                return back()->with('error', 'Cannot delete product that has sales history.');
            }

            // Check if product in active purchases
            if ($product->purchaseItems()->whereHas('purchase', function($q) {
                $q->where('status', 'pending');
            })->exists()) {
                return back()->with('error', 'Cannot delete product with pending purchases.');
            }

            DB::beginTransaction();

            // Delete image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $product->delete();

            DB::commit();

            return redirect()->route('products.index')
                ->with('success', 'Product deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Product Deletion Failed', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    private function generateUniqueSKU(): string
    {
        do {
            $sku = 'PRD-' . strtoupper(Str::random(6));
        } while (Product::where('sku', $sku)->exists());

        return $sku;
    }
}