// ========================================
// FILE: resources/js/Pages/Roles/Create.jsx
// ========================================
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RoleCreate({ permissions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    const togglePermission = (permissionName) => {
        const newPermissions = data.permissions.includes(permissionName)
            ? data.permissions.filter((p) => p !== permissionName)
            : [...data.permissions, permissionName];
        setData('permissions', newPermissions);
    };

    const toggleGroup = (groupPermissions) => {
        const allSelected = groupPermissions.every((p) =>
            data.permissions.includes(p.name)
        );
        
        if (allSelected) {
            setData(
                'permissions',
                data.permissions.filter((p) => !groupPermissions.map((gp) => gp.name).includes(p))
            );
        } else {
            setData('permissions', [
                ...new Set([...data.permissions, ...groupPermissions.map((p) => p.name)]),
            ]);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Role" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('roles.index')}>
                        <button className="rounded-lg p-2 hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Create a new role with permissions
                        </p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                className="mt-1"
                                placeholder="e.g., supervisor, accountant"
                                autoFocus
                            />
                        </div>

                        {/* Permissions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Permissions <span className="text-red-500">*</span>
                            </label>
                            {errors.permissions && (
                                <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
                            )}

                            <div className="mt-3 space-y-4">
                                {Object.entries(permissions).map(([group, groupPermissions]) => (
                                    <div key={group} className="rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium capitalize text-gray-900">
                                                {group}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(groupPermissions)}
                                                className="text-sm text-indigo-600 hover:text-indigo-700"
                                            >
                                                {groupPermissions.every((p) =>
                                                    data.permissions.includes(p.name)
                                                )
                                                    ? 'Deselect All'
                                                    : 'Select All'}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                            {groupPermissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-center gap-2 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={data.permissions.includes(
                                                            permission.name
                                                        )}
                                                        onChange={() =>
                                                            togglePermission(permission.name)
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {permission.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t pt-6">
                            <Link href={route('roles.index')}>
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Role'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}