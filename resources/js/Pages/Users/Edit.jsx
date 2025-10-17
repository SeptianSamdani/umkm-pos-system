// ========================================
// FILE: resources/js/Pages/Users/Edit.jsx
// ========================================
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function UserEdit({ user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        role: user.roles?.[0] || 'cashier',
        is_active: user.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit ${user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('users.index')}>
                        <button className="rounded-lg p-2 hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Update user information
                        </p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    className="mt-1"
                                    autoFocus
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={errors.email}
                                className="mt-1"
                            />
                        </div>

                        <div className="rounded-lg bg-yellow-50 p-4">
                            <p className="text-sm font-medium text-yellow-800">
                                Leave password fields empty to keep current password
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    className="mt-1"
                                    placeholder="Min. 8 characters"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    error={errors.password_confirmation}
                                    className="mt-1"
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                error={errors.role}
                                className="mt-1"
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Active Status */}
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Active
                                </span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t pt-6">
                            <Link href={route('users.index')}>
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update User'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}