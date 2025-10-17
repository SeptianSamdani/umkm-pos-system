<?php

// FILE: app/Http/Controllers/RoleController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users', 'permissions')->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[1] ?? 'other';
        });

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name']]);
        $role->givePermissionTo($validated['permissions']);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        // Prevent editing default roles
        if (in_array($role->name, ['owner', 'manager', 'cashier'])) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot edit default roles!');
        }

        $permissions = Permission::all()->groupBy(function($permission) {
            return explode(' ', $permission->name)[1] ?? 'other';
        });

        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name'),
            ],
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        // Prevent editing default roles
        if (in_array($role->name, ['owner', 'manager', 'cashier'])) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot edit default roles!');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions']);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        // Prevent deleting default roles
        if (in_array($role->name, ['owner', 'manager', 'cashier'])) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete default roles!');
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete role with assigned users!');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}