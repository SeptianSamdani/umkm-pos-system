// ========================================
// FILE: resources/js/Pages/Categories/Create.jsx
// ========================================
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CategoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        color: '#007bff',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    const colorPresets = [
        '#007bff', // Blue
        '#28a745', // Green
        '#dc3545', // Red
        '#ffc107', // Yellow
        '#17a2b8', // Cyan
        '#6f42c1', // Purple
        '#e83e8c', // Pink
        '#fd7e14', // Orange
        '#20c997', // Teal
        '#6c757d', // Gray
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create Category" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('categories.index')}>
                        <button className="rounded-lg p-2 hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create Category
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Add a new product category
                        </p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                className="mt-1"
                                placeholder="e.g., Electronics, Food, Clothing"
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Brief description of this category"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Color <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2 flex items-center gap-4">
                                <div className="flex gap-2">
                                    {colorPresets.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setData('color', color)}
                                            className={`h-10 w-10 rounded-lg border-2 transition-all ${
                                                data.color === color
                                                    ? 'scale-110 border-gray-900 ring-2 ring-gray-300'
                                                    : 'border-gray-300 hover:scale-105'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
                                    />
                                    <span className="text-sm text-gray-600">
                                        {data.color}
                                    </span>
                                </div>
                            </div>
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Active
                                </span>
                            </label>
                            <p className="ml-6 text-sm text-gray-500">
                                Inactive categories won't be shown in product forms
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t pt-6">
                            <Link href={route('categories.index')}>
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}