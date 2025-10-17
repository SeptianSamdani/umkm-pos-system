// ========================================
// FILE: resources/js/Pages/Users/Create.jsx
// ========================================
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function UserCreate({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create User" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('users.index')}>
                        <button className="rounded-lg p-2 hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
                        <p className="mt-1 text-sm text-gray-600">Add a new system user</p>
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
                                    placeholder="John Doe"
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
                                    placeholder="081234567890"
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
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
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
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    error={errors.password_confirmation}
                                    className="mt-1"
                                    placeholder="Repeat password"
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
                            <p className="ml-6 text-sm text-gray-500">
                                Inactive users cannot login to the system
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t pt-6">
                            <Link href={route('users.index')}>
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create User'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}