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
                toast.dismiss(loadingId); 
                if (!page.props?.flash?.success) {
                    showSuccess('Product created successfully'); 
                }
            }, 
            onError: (errs) => {
                toast.dismiss(loadingId);
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

            <div className="space-y-6 w-full max-w-full">
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
                    <div className="flex flex-col gap-6 lg:flex-row w-full"> 
                        {/* Left Column - Image */}
                        <Card className="lg:w-2/5 w-full border border-indigo-100"> 
                            <h3 className="mb-4 font-semibold text-gray-900">Product Image</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8"> 
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="max-h-80 w-full rounded-lg object-contain"
                                        />
                                    ) : (
                                        <div className="text-center py-8"> 
                                            <PhotoIcon className="mx-auto h-16 w-16 text-gray-400" /> 
                                            <p className="mt-4 text-sm text-gray-500">
                                                No image selected
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-3 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {errors.image && (
                                    <p className="text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>
                        </Card>

                        {/* Right Column - Form */}
                        <Card className="lg:w-3/5 w-full max-w-none">
                            <div className="space-y-6 p-6"> 
                                {/* Basic Info - Perlebar grid internal */}
                                <div>
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900"> {/* Perbesar */}
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3"> {/* Ubah ke 3 kolom */}
                                        {/* Category */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Category
                                            </label>
                                            <Select
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                error={errors.category_id}
                                                className="mt-2 w-full"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>

                                        {/* Supplier */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Supplier <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={data.supplier_id}
                                                onChange={(e) => setData('supplier_id', e.target.value)}
                                                error={errors.supplier_id}
                                                className="mt-2 w-full"
                                            >
                                                <option value="">Select Supplier</option>
                                                {suppliers.map((supplier) => (
                                                    <option key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>

                                        {/* Unit */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Unit <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={data.unit}
                                                onChange={(e) => setData('unit', e.target.value)}
                                                error={errors.unit}
                                                className="mt-2 w-full"
                                            >
                                                <option value="pcs">Pieces (pcs)</option>
                                                <option value="kg">Kilogram (kg)</option>
                                                <option value="liter">Liter (liter)</option>
                                                <option value="box">Box</option>
                                                <option value="pack">Pack</option>
                                            </Select>
                                        </div>

                                        {/* SKU */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                SKU
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                error={errors.sku}
                                                className="mt-2 w-full"
                                                placeholder="Auto-generated if empty"
                                            />
                                        </div>

                                        {/* Barcode */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Barcode
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.barcode}
                                                onChange={(e) => setData('barcode', e.target.value)}
                                                error={errors.barcode}
                                                className="mt-2 w-full"
                                            />
                                        </div>

                                        {/* Min Stock */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Minimum Stock <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                value={data.min_stock}
                                                onChange={(e) => setData('min_stock', e.target.value)}
                                                error={errors.min_stock}
                                                className="mt-2 w-full"
                                            />
                                        </div>

                                        {/* Product Name - Full Width */}
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                error={errors.name}
                                                className="mt-2 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Stock - Perlebar juga */}
                                <div>
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900">
                                        Pricing & Inventory
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3"> {/* 3 kolom */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cost Price <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={data.cost}
                                                onChange={(e) => setData('cost', e.target.value)}
                                                error={errors.cost}
                                                className="mt-2 w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Selling Price <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                error={errors.price}
                                                className="mt-2 w-full"
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
                                                className="mt-2 w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description - Lebih lebar */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Active
                                        </span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-4 border-t pt-8">
                                    <Link href={route('products.index')}>
                                        <Button variant="secondary" type="button" className="px-6 py-2">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing} className="px-8 py-2">
                                        {processing ? 'Creating...' : 'Create Product'}
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