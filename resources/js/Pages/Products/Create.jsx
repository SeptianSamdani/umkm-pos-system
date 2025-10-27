import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Select from '@/Components/Select';
import Textarea from '@/Components/Textarea';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ArrowLeftIcon,
    ArrowRightIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';

export default function ProductsCreate({ categories, suppliers }) {
    const [form, setForm] = useState({
        category_id: '',
        supplier_id: '',
        name: '',
        sku: '',
        barcode: '',
        cost: '',
        price: '',
        stock: '',
        unit: '',
        min_stock: '',
        description: '',
        image: null,
        is_active: true,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            setForm(prev => ({ ...prev, [name]: file }));
            
            // Create preview
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setImagePreview(e.target.result);
                reader.readAsDataURL(file);
            } else {
                setImagePreview(null);
            }
        } else if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== '') {
                formData.append(key, form[key]);
            }
        });

        router.post(route('products.store'), formData, {
            preserveScroll: true,
            onError: (err) => setErrors(err),
            onFinish: () => setForm(prev => ({ ...prev, image: null })),
        });
    };

    const units = [
        'pcs', 'unit', 'box', 'pack', 'kg', 'gram', 'liter', 'ml', 'meter', 'cm'
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Create Product" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                        <div className='ml-3'>
                            <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Add a new product to your inventory
                            </p>
                        </div>
                        <Link href={route('products.index')}>
                            <Button variant="secondary" className="flex items-center gap-2">
                                Back
                                <ArrowRightIcon className="h-5 w-5" />
                            </Button>
                        </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Basic Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <Input
                                            label="Product Name *"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            error={errors.name}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Input
                                            label="SKU"
                                            name="sku"
                                            value={form.sku}
                                            onChange={handleChange}
                                            error={errors.sku}
                                            placeholder="Auto-generated if empty"
                                        />
                                        <Input
                                            label="Barcode"
                                            name="barcode"
                                            value={form.barcode}
                                            onChange={handleChange}
                                            error={errors.barcode}
                                            placeholder="Optional barcode"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Select
                                            label="Category"
                                            name="category_id"
                                            value={form.category_id}
                                            onChange={handleChange}
                                            error={errors.category_id}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Supplier"
                                            name="supplier_id"
                                            value={form.supplier_id}
                                            onChange={handleChange}
                                            error={errors.supplier_id}
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>

                                    <Textarea
                                        label="Description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        error={errors.description}
                                        placeholder="Product description..."
                                        rows={4}
                                    />
                                </div>
                            </Card>

                            {/* Pricing & Stock */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Pricing & Stock
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Input
                                            label="Cost Price *"
                                            name="cost"
                                            type="number"
                                            value={form.cost}
                                            onChange={handleChange}
                                            error={errors.cost}
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        <Input
                                            label="Selling Price *"
                                            name="price"
                                            type="number"
                                            value={form.price}
                                            onChange={handleChange}
                                            error={errors.price}
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <Input
                                            label="Current Stock *"
                                            name="stock"
                                            type="number"
                                            value={form.stock}
                                            onChange={handleChange}
                                            error={errors.stock}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                        <Input
                                            label="Minimum Stock *"
                                            name="min_stock"
                                            type="number"
                                            value={form.min_stock}
                                            onChange={handleChange}
                                            error={errors.min_stock}
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                        <Select
                                            label="Unit *"
                                            name="unit"
                                            value={form.unit}
                                            onChange={handleChange}
                                            error={errors.unit}
                                            required
                                        >
                                            <option value="">Select Unit</option>
                                            {units.map((unit) => (
                                                <option key={unit} value={unit}>
                                                    {unit}
                                                </option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Image & Status */}
                        <div className="space-y-6">
                            {/* Image Upload */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Product Image
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-48 w-48 rounded-lg object-cover border-2 border-gray-300"
                                                />
                                            ) : (
                                                <div className="h-48 w-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                                                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                                                    <span className="mt-2 text-sm text-gray-500">
                                                        No image
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Input
                                            type="file"
                                            name="image"
                                            onChange={handleChange}
                                            error={errors.image}
                                            accept="image/*"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            JPG, PNG, WebP. Max 2MB
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Status */}
                            <Card>
                                <h2 className="text-lg font-medium text-gray-900 mb-4">
                                    Status
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={form.is_active}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-900">
                                            Product is active
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Inactive products won't appear in sales and purchases
                                    </p>
                                </div>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full">
                                        Create Product
                                    </Button>
                                    <Link href={route('products.index')}>
                                        <Button variant="danger" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}