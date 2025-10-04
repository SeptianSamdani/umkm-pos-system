<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'company_name',
                'value' => 'Toko POS',
                'group' => 'general',
                'description' => 'Nama perusahaan',
            ],
            [
                'key' => 'company_phone',
                'value' => '021-12345678',
                'group' => 'general',
                'description' => 'Nomor telepon',
            ],
            [
                'key' => 'company_address',
                'value' => 'Jakarta, Indonesia',
                'group' => 'general',
                'description' => 'Alamat perusahaan',
            ],
            [
                'key' => 'tax_percentage',
                'value' => '11',
                'group' => 'pos',
                'description' => 'Persentase pajak (PPN)',
            ],
            [
                'key' => 'currency',
                'value' => 'IDR',
                'group' => 'system',
                'description' => 'Mata uang',
            ],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}