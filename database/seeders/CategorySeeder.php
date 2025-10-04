<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Makanan', 'description' => 'Produk makanan', 'color' => '#28a745'],
            ['name' => 'Minuman', 'description' => 'Produk minuman', 'color' => '#007bff'],
            ['name' => 'Elektronik', 'description' => 'Produk elektronik', 'color' => '#ffc107'],
            ['name' => 'Pakaian', 'description' => 'Produk pakaian', 'color' => '#e83e8c'],
            ['name' => 'Alat Tulis', 'description' => 'Produk alat tulis', 'color' => '#17a2b8'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}