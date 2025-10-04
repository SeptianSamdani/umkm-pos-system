<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::create([
            'name' => 'Owner',
            'email' => 'owner@pos.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $owner->assignRole('owner');

        $manager = User::create([
            'name' => 'Manager',
            'email' => 'manager@pos.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $manager->assignRole('manager');

        $cashier = User::create([
            'name' => 'Cashier',
            'email' => 'cashier@pos.com',
            'phone' => '081234567892',
            'password' => Hash::make('password'),
            'is_active' => true,
        ]);
        $cashier->assignRole('cashier');
    }
}