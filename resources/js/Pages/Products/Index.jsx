import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import { Head, Link, router } from '@inertiajs/react';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    MagnifyingGlassIcon,
    ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import usePermission from '@/Hooks/usePermission';

export default function ProductsIndex({ products, categories, filters }) {
    const { can } = usePermission();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id || '');
    const [stockFilter, setStockFilter] = useState(filters.stock_status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('products.index'), 
            { 
                search, 
                category_id: categoryFilter,
                stock_status: stockFilter 
            },
            { preserveState: true }
        );
    };

    const handleDelete = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            router.delete(route('products.destroy', productToDelete.id), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                },
            });
        }
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const columns = [
        {
            label: 'Product',
            key: 'name',
            render: (product) => (
                <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    {product.barcode && (
                        <p className="text-xs text-gray-500">Barcode: {product.barcode}</p>
                    )}
                </div>
            ),
        },
        {
            label: 'Category',
            key: 'category',
            render: (product) => (
                <span className="text-sm text-gray-600">
                    {product.category?.name || '-'}
                </span>
            ),
        },
        {
            label: 'Price',
            key: 'price',
            render: (product) => (
                <div>
                    <p className="font-medium text-gray-900">{formatRupiah(product.price)}</p>
                    <p className="text-xs text-gray-500">Cost: {formatRupiah(product.cost)}</p>
                </div>
            ),
        },
        {
            label: 'Stock',
            key: 'stock',
            render: (product) => {
                const isLow = product.stock <= product.min_stock;
                const isOut = product.stock === 0;
                return (
                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                            isOut ? 'text-red-600' : 
                            isLow ? 'text-yellow-600' : 
                            'text-green-600'
                        }`}>
                            {product.stock} {product.unit}
                        </span>
                        {isLow && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                        )}
                    </div>
                );
            },
        },
        {
            label: 'Status',
            key: 'is_active',
            render: (product) => (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    product.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your product inventory
                        </p>
                    </div>
                    {can('create products') && (
                        <Link href={route('products.create')}>
                            <Button className="flex items-center gap-2">
                                <PlusIcon className="h-5 w-5" />
                                Add Product
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <form onSubmit={handleSearch} className="space-y-3">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search products (name, SKU, barcode)..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-48"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-48"
                            >
                                <option value="">All Stock</option>
                                <option value="low">Low Stock</option>
                                <option value="out">Out of Stock</option>
                            </Select>
                            <Button type="submit">Search</Button>
                        </div>
                    </form>
                </Card>

                {/* Table */}
                <Card>
                    <Table
                        columns={columns}
                        data={products.data}
                        actions={(product) => (
                            <div className="flex items-center justify-end gap-2">
                                {can('edit products') && (
                                    <Link href={route('products.edit', product.id)}>
                                        <button className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </Link>
                                )}
                                {can('delete products') && (
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    />
                    <Pagination links={products.links} />
                </Card>
            </div>

            {/* Delete Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                maxWidth="md"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                    <p className="mt-2 text-sm text-gray-600">
                        Are you sure you want to delete "<strong>{productToDelete?.name}</strong>"?
                        This action cannot be undone.
                    </p>
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