// ========================================
// FILE: resources/js/Components/POS/InvoiceModal.jsx
// ========================================
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
    XMarkIcon, 
    PrinterIcon,
    CheckCircleIcon 
} from '@heroicons/react/24/outline';
import Button from '@/Components/Button';

export default function InvoiceModal({ show, onClose, sale, onPrint }) {
    if (!sale) return null;

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                                {/* Success Header */}
                                <div className="bg-green-50 p-6 text-center">
                                    <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
                                    <h3 className="mt-3 text-2xl font-bold text-green-900">
                                        Transaction Successful!
                                    </h3>
                                    <p className="mt-1 text-sm text-green-700">
                                        Invoice: {sale.invoice}
                                    </p>
                                </div>

                                {/* Invoice Details */}
                                <div className="p-6">
                                    {/* Date & Customer */}
                                    <div className="mb-4 space-y-1 border-b pb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium">
                                                {formatDate(sale.sale_date)}
                                            </span>
                                        </div>
                                        {sale.customer && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Customer:</span>
                                                <span className="font-medium">
                                                    {sale.customer.name}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Cashier:</span>
                                            <span className="font-medium">
                                                {sale.user?.name || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="font-medium capitalize">
                                                {sale.payment_method}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="mb-4 max-h-48 overflow-y-auto border-b pb-4">
                                        <h4 className="mb-2 font-semibold text-gray-900">Items:</h4>
                                        <div className="space-y-2">
                                            {sale.items?.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatRupiah(item.price)} × {item.qty}
                                                        </p>
                                                    </div>
                                                    <span className="font-medium">
                                                        {formatRupiah(item.subtotal)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">
                                                {formatRupiah(sale.subtotal)}
                                            </span>
                                        </div>
                                        {sale.discount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Discount:</span>
                                                <span className="font-medium text-red-600">
                                                    -{formatRupiah(sale.discount)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax (11%):</span>
                                            <span className="font-medium">
                                                {formatRupiah(sale.tax)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-indigo-600">
                                                {formatRupiah(sale.total)}
                                            </span>
                                        </div>
                                        
                                        {/* Cash & Change */}
                                        {sale.payment_method === 'cash' && (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Cash Received:</span>
                                                    <span className="font-medium">
                                                        {formatRupiah(sale.cash_received)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-base font-bold text-green-600">
                                                    <span>Change:</span>
                                                    <span>{formatRupiah(sale.change)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 bg-gray-50 px-6 py-4">
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => onPrint(sale)}
                                        className="flex flex-1 items-center justify-center gap-2"
                                    >
                                        <PrinterIcon className="h-5 w-5" />
                                        Print Receipt
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}