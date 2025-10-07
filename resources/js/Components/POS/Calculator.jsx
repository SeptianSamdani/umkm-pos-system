// ========================================
// FILE: resources/js/Components/POS/Calculator.jsx
// ========================================
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Calculator({ total, onComplete, onClose }) {
    const [received, setReceived] = useState('');

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleNumberClick = (num) => {
        setReceived(prev => prev + num);
    };

    const handleClear = () => {
        setReceived('');
    };

    const handleExact = () => {
        setReceived(total.toString());
    };

    const handleQuickAmount = (amount) => {
        setReceived(amount.toString());
    };

    const handleComplete = () => {
        const receivedAmount = parseFloat(received) || 0;
        if (receivedAmount >= total) {
            onComplete(receivedAmount);
        }
    };

    const receivedAmount = parseFloat(received) || 0;
    const change = receivedAmount - total;
    const canComplete = receivedAmount >= total;

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <h3 className="text-lg font-bold">Payment Calculator</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Display */}
            <div className="space-y-4 p-6">
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatRupiah(total)}</p>
                </div>

                <div className="rounded-lg bg-indigo-50 p-4">
                    <p className="text-sm text-indigo-600">Cash Received</p>
                    <p className="text-3xl font-bold text-indigo-900">
                        {received ? formatRupiah(receivedAmount) : 'Rp 0'}
                    </p>
                </div>

                {receivedAmount > 0 && (
                    <div className={`rounded-lg p-4 ${canComplete ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className={`text-sm ${canComplete ? 'text-green-600' : 'text-red-600'}`}>
                            Change
                        </p>
                        <p className={`text-2xl font-bold ${canComplete ? 'text-green-900' : 'text-red-900'}`}>
                            {formatRupiah(change)}
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 px-6 pb-4">
                {[10000, 20000, 50000, 100000].map((amount) => (
                    <button
                        key={amount}
                        onClick={() => handleQuickAmount(amount)}
                        className="rounded-lg bg-gray-100 py-3 text-sm font-medium hover:bg-gray-200"
                    >
                        {formatRupiah(amount)}
                    </button>
                ))}
            </div>

            {/* Calculator */}
            <div className="grid flex-1 grid-cols-4 gap-2 p-6 pt-0">
                {[7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num.toString())}
                        className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={handleClear}
                    className="rounded-lg bg-red-100 py-4 text-sm font-semibold text-red-600 hover:bg-red-200"
                >
                    CLR
                </button>

                {[4, 5, 6].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num.toString())}
                        className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={() => handleNumberClick('000')}
                    className="rounded-lg bg-gray-100 py-4 text-lg font-semibold hover:bg-gray-200"
                >
                    000
                </button>

                {[1, 2, 3].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num.toString())}
                        className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200"
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={() => handleNumberClick('00')}
                    className="rounded-lg bg-gray-100 py-4 text-lg font-semibold hover:bg-gray-200"
                >
                    00
                </button>

                <button
                    onClick={handleExact}
                    className="col-span-2 rounded-lg bg-yellow-100 py-4 text-sm font-semibold text-yellow-700 hover:bg-yellow-200"
                >
                    EXACT
                </button>
                <button
                    onClick={() => handleNumberClick('0')}
                    className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200"
                >
                    0
                </button>
                <button
                    onClick={() => handleNumberClick('.')}
                    className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200"
                    disabled
                >
                    .
                </button>
            </div>

            {/* Complete Button */}
            <div className="border-t p-6">
                <button
                    onClick={handleComplete}
                    disabled={!canComplete}
                    className={`w-full rounded-lg py-4 text-lg font-bold text-white ${
                        canComplete
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'cursor-not-allowed bg-gray-300'
                    }`}
                >
                    {canComplete ? 'Complete Payment' : 'Insufficient Amount'}
                </button>
            </div>
        </div>
    );
}