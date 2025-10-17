<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions
        $permissions = [
            'view products',
            'create products',
            'edit products',
            'delete products',
            
            'view sales',
            'create sales',
            'delete sales',
            
            'view purchases',
            'create purchases',
            'receive purchases',
            
            'view customers',
            'create customers',
            'edit customers',
            
            'view suppliers',
            'create suppliers',
            'edit suppliers',
            
            'view reports',
            'export reports',
            
            'view stock logs',

            'manage users',      
            'view users',        
            'create users',      
            'edit users',        
            'delete users',      
            
            'manage roles', // (for owner only)
            
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Roles
        $owner = Role::create(['name' => 'owner']);
        $owner->givePermissionTo(Permission::all());

        $manager = Role::create(['name' => 'manager']);
        $manager->givePermissionTo([
            'view products', 'create products', 'edit products', 'delete products',
            'view sales', 'create sales',
            'view purchases', 'create purchases', 'receive purchases',
            'view customers', 'create customers', 'edit customers',
            'view suppliers', 'create suppliers', 'edit suppliers',
            'view reports', 'export reports',
            'view stock logs',
            'view users', 'create users', 'edit users', 
        ]);

        $cashier = Role::create(['name' => 'cashier']);
        $cashier->givePermissionTo([
            'view products',
            'view sales', 'create sales',
            'view customers', 'create customers',
        ]);
    }
}