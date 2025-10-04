<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Customer Umum',
                'phone' => null,
                'email' => null,
                'address' => null,
            ],
            [
                'name' => 'John Doe',
                'phone' => '081234567801',
                'email' => 'john@email.com',
                'address' => 'Jakarta',
            ],
            [
                'name' => 'Jane Smith',
                'phone' => '081234567802',
                'email' => 'jane@email.com',
                'address' => 'Bandung',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}