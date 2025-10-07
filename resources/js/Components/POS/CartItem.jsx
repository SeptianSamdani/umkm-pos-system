// ========================================
// FILE: resources/js/Components/POS/CartItem.jsx
// ========================================
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CartItem({ item, onUpdateQty, onRemove }) {
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const itemSubtotal = (item.price * item.qty) - (item.discount || 0);

    return (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.sku}</p>
                <p className="text-sm font-medium text-indigo-600">
                    {formatRupiah(item.price)} × {item.qty}
                </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdateQty(item.id, item.qty - 1)}
                    className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.qty <= 1}
                >
                    <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold">{item.qty}</span>
                <button
                    onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.qty >= item.stock}
                >
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Subtotal & Remove */}
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{formatRupiah(itemSubtotal)}</p>
                    {item.discount > 0 && (
                        <p className="text-xs text-red-600">-{formatRupiah(item.discount)}</p>
                    )}
                </div>
                <button
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}