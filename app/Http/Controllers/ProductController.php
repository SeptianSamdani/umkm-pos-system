<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
                  ->orWhere('barcode', 'like', "%{$request->search}%");
            });
        }

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by stock status
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
            'sku' => 'required|string|max:255|unique:products,sku',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'cost' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'min_stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully.');
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
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'required|string|max:20',
            'min_stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete image
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}