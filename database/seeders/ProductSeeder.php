<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'category_id' => 1,
                'supplier_id' => 1,
                'name' => 'Indomie Goreng',
                'sku' => 'MAK-001',
                'barcode' => '8991234567890',
                'cost' => 2500,
                'price' => 3500,
                'stock' => 100,
                'unit' => 'pcs',
                'min_stock' => 20,
            ],
            [
                'category_id' => 2,
                'supplier_id' => 1,
                'name' => 'Aqua 600ml',
                'sku' => 'MIN-001',
                'barcode' => '8991234567891',
                'cost' => 2000,
                'price' => 3000,
                'stock' => 150,
                'unit' => 'botol',
                'min_stock' => 30,
            ],
            [
                'category_id' => 3,
                'supplier_id' => 2,
                'name' => 'Power Bank 10000mAh',
                'sku' => 'ELK-001',
                'barcode' => '8991234567892',
                'cost' => 150000,
                'price' => 200000,
                'stock' => 25,
                'unit' => 'pcs',
                'min_stock' => 5,
            ],
            [
                'category_id' => 4,
                'supplier_id' => 2,
                'name' => 'Kaos Polos',
                'sku' => 'PAK-001',
                'barcode' => '8991234567893',
                'cost' => 35000,
                'price' => 55000,
                'stock' => 50,
                'unit' => 'pcs',
                'min_stock' => 10,
            ],
            [
                'category_id' => 5,
                'supplier_id' => 3,
                'name' => 'Pulpen Hitam',
                'sku' => 'ATK-001',
                'barcode' => '8991234567894',
                'cost' => 2000,
                'price' => 3500,
                'stock' => 200,
                'unit' => 'pcs',
                'min_stock' => 50,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}