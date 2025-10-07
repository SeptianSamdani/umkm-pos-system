// ========================================
// FILE: resources/js/Components/POS/ProductCard.jsx
// ========================================
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product, onAddToCart }) {
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const isLowStock = product.stock <= (product.min_stock || 0);
    const categoryName = product.category?.name || 'No Category';

    return (
        <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`group relative flex flex-col rounded-lg border-2 p-4 text-left transition-all ${
                product.stock <= 0
                    ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50'
                    : 'border-gray-200 bg-white hover:border-indigo-500 hover:shadow-lg'
            }`}
        >
            {/* Stock Badge */}
            <div className="absolute right-2 top-2">
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.stock <= 0
                            ? 'bg-red-100 text-red-700'
                            : isLowStock
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                    }`}
                >
                    {product.stock} {product.unit || 'pcs'}
                </span>
            </div>

            {/* Product Info */}
            <div className="mb-3 pr-12">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{product.sku}</p>
                <p className="mt-1 text-xs text-indigo-600">{categoryName}</p>
            </div>

            {/* Price & Add Button */}
            <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                    {formatRupiah(product.price)}
                </span>
                {product.stock > 0 && (
                    <div className="rounded-full bg-indigo-600 p-2 text-white group-hover:bg-indigo-700">
                        <PlusIcon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </button>
    );
}