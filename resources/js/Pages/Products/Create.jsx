// ========================================
// FILE: resources/js/Pages/Products/Create.jsx
// ========================================
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { showLoading, showSuccess, showError } from '@/utils/toast';

export default function ProductCreate({ categories, suppliers }) {
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        supplier_id: '',
        name: '',
        sku: '',
        barcode: '',
        cost: '',
        price: '',
        stock: '',
        unit: 'pcs',
        min_stock: '5',
        description: '',
        image: null,
        is_active: true,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const loadingId = showLoading('Creating product...'); 

        post(route('products.store'), {
            forceFormData: true,
            onSuccess: (page) => {
                // dismiss loading
                toast.dismiss(loadingId); 

                if (!page.props?.flash?.success) {
                    showSuccess('Product created successfully'); 
                }
            }, 
            onError: (errs) => {
                toast.dismiss(loadingId);

                // Ambil pesan validasi pertama jika ada, fallback ke pesan umum
                const firstError = Object.values(errs)[0];
                const message = firstError
                    ? (Array.isArray(firstError) ? firstError[0] : firstError)
                    : 'Failed to create product.';
                
                showError(message);
            }, 
            onFinish: () => {
                toast.dismiss(loadingId); 
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Product" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('products.index')}>
                        <button className="rounded-lg p-2 hover:bg-gray-100">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
                        <p className="mt-1 text-sm text-gray-600">Add a new product</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Image */}
                        <Card className="lg:col-span-1">
                            <h3 className="mb-4 font-semibold text-gray-900">Product Image</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="max-h-64 rounded-lg object-contain"
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                No image selected
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {errors.image && (
                                    <p className="text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>
                        </Card>

                        {/* Right Column - Form */}
                        <Card className="lg:col-span-2">
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="mb-4 font-semibold text-gray-900">
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="mb-3">
                                                <Input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    error={errors.name}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Supplier Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="">
                                                <Select>
                                                    <option value="">Select Supplier</option>
                                                    {suppliers.map((supplier) => (
                                                        <option key={supplier.id} value={supplier.id}>
                                                            {supplier.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Stock */}
                                <div>
                                    <h3 className="mb-4 font-semibold text-gray-900">
                                        Pricing & Inventory
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cost Price <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={data.cost}
                                                onChange={(e) => setData('cost', e.target.value)}
                                                error={errors.cost}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Selling Price <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                error={errors.price}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Stock <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                error={errors.stock}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Unit <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={data.unit}
                                                onChange={(e) => setData('unit', e.target.value)}
                                                error={errors.unit}
                                                className="mt-1"
                                            >
                                                <option value="pcs">Pieces (pcs)</option>
                                                <option value="kg">Kilogram (kg)</option>
                                                <option value="liter">Liter (liter)</option>
                                                <option value="box">Box</option>
                                                <option value="pack">Pack</option>
                                            </Select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Minimum Stock <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={data.min_stock}
                                                onChange={(e) =>
                                                    setData('min_stock', e.target.value)
                                                }
                                                error={errors.min_stock}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
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
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Link href={route('products.index')}>
                                        <Button variant="secondary" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Product'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}