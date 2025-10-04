<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'PT Supplier Indonesia',
                'contact_person' => 'Budi Santoso',
                'phone' => '021-12345678',
                'email' => 'budi@supplier.com',
                'address' => 'Jakarta',
            ],
            [
                'name' => 'CV Maju Jaya',
                'contact_person' => 'Siti Nurhaliza',
                'phone' => '021-87654321',
                'email' => 'siti@majujaya.com',
                'address' => 'Bandung',
            ],
            [
                'name' => 'Toko Grosir ABC',
                'contact_person' => 'Ahmad Wijaya',
                'phone' => '021-11223344',
                'email' => 'ahmad@abc.com',
                'address' => 'Surabaya',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}