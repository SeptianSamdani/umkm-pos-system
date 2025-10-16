// ========================================
// FILE: resources/js/Pages/Categories/Index.jsx
// ========================================
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import usePermission from '@/Hooks/usePermission';

export default function CategoriesIndex({ categories }) {
    const { can } = usePermission();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const handleDelete = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('categories.destroy', categoryToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                },
            });
        }
    };

    const columns = [
        {
            label: 'Name',
            key: 'name',
            render: (category) => (
                <div className="flex items-center gap-3">
                    <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                </div>
            ),
        },
        {
            label: 'Description',
            key: 'description',
            render: (category) => (
                <span className="text-gray-600">
                    {category.description || '-'}
                </span>
            ),
        },
        {
            label: 'Products',
            key: 'products_count',
            render: (category) => (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                    {category.products_count || 0}
                </span>
            ),
        },
        {
            label: 'Status',
            key: 'is_active',
            render: (category) => (
                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        category.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {category.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Categories" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your product categories
                        </p>
                    </div>
                    {can('create products') && (
                        <Link href={route('categories.create')}>
                            <Button className="flex items-center gap-2">
                                <PlusIcon className="h-5 w-5" />
                                Add Category
                            </Button>
                        </Link>
                    )}
                </div>

                <Card>
                    <Table
                        columns={columns}
                        data={categories.data}
                        actions={(category) => (
                            <div className="flex items-center justify-end gap-2">
                                {can('edit products') && (
                                    <Link href={route('categories.edit', category.id)}>
                                        <button className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </Link>
                                )}
                                {can('delete products') && (
                                    <button
                                        onClick={() => handleDelete(category)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    />
                    <Pagination links={categories.links} />
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                maxWidth="md"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Delete Category
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete "
                        <strong>{categoryToDelete?.name}</strong>"? This action cannot be
                        undone.
                    </p>
                    {categoryToDelete && categoryToDelete.products_count > 0 && (
                        <div className="mt-3 rounded-lg bg-yellow-50 p-3">
                            <p className="text-sm text-yellow-800">
                                ⚠️ This category has {categoryToDelete.products_count}{' '}
                                product(s). They will be uncategorized.
                            </p>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
