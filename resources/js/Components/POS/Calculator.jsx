import { useState, useCallback, useMemo } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Calculator({ total, onComplete, onClose }) {
    const [received, setReceived] = useState('');

    const formatRupiah = useCallback((amount) => {
        return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}, []);

const handleNumberClick = useCallback((num) => {
    setReceived(prev => {
        // Prevent multiple zeros at start
        if (prev === '' && num === '0') return '0';
        if (prev === '0' && num !== '.') return num;
        
        // Prevent multiple dots
        if (num === '.' && prev.includes('.')) return prev;
        
        // Limit to 15 characters
        if (prev.length >= 15) return prev;
        
        return prev + num;
    });
}, []);

const handleClear = useCallback(() => {
    setReceived('');
}, []);

const handleBackspace = useCallback(() => {
    setReceived(prev => prev.slice(0, -1));
}, []);

const handleExact = useCallback(() => {
    setReceived(total.toString());
}, [total]);

const handleQuickAmount = useCallback((amount) => {
    setReceived(amount.toString());
}, []);

const handleComplete = useCallback(() => {
    const receivedAmount = parseFloat(received) || 0;
    if (receivedAmount >= total) {
        onComplete(receivedAmount);
    }
}, [received, total, onComplete]);

// Memoized calculations
const { receivedAmount, change, canComplete } = useMemo(() => {
    const amt = parseFloat(received) || 0;
    return {
        receivedAmount: amt,
        change: amt - total,
        canComplete: amt >= total,
    };
}, [received, total]);

// Quick amount suggestions
const quickAmounts = useMemo(() => {
    const suggestions = [10000, 20000, 50000, 100000];
    
    // Add smart suggestions based on total
    const rounded = Math.ceil(total / 10000) * 10000;
    if (rounded > total && !suggestions.includes(rounded)) {
        suggestions.push(rounded);
    }
    
    return suggestions.sort((a, b) => a - b).slice(0, 4);
}, [total]);

return (
    <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-bold">Payment Calculator</h3>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>

        {/* Display */}
        <div className="space-y-4 p-6">
            {/* Total Amount */}
            <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(total)}</p>
            </div>

            {/* Cash Received */}
            <div className={`rounded-lg p-4 transition-colors ${
                receivedAmount > 0 && receivedAmount < total
                    ? 'bg-red-50'
                    : 'bg-indigo-50'
            }`}>
                <p className={`text-sm ${
                    receivedAmount > 0 && receivedAmount < total
                        ? 'text-red-600'
                        : 'text-indigo-600'
                }`}>
                    Cash Received
                </p>
                <p className={`text-3xl font-bold ${
                    receivedAmount > 0 && receivedAmount < total
                        ? 'text-red-900'
                        : 'text-indigo-900'
                }`}>
                    {received ? formatRupiah(receivedAmount) : 'Rp 0'}
                </p>
            </div>

            {/* Change */}
            {receivedAmount > 0 && (
                <div className={`rounded-lg p-4 transition-all ${
                    canComplete 
                        ? 'bg-green-50' 
                        : 'bg-red-50'
                }`}>
                    <p className={`text-sm ${
                        canComplete ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {canComplete ? 'Change' : 'Insufficient'}
                    </p>
                    <p className={`text-2xl font-bold ${
                        canComplete ? 'text-green-900' : 'text-red-900'
                    }`}>
                        {formatRupiah(canComplete ? change : total - receivedAmount)}
                    </p>
                </div>
            )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 px-6 pb-4">
            {quickAmounts.map((amount) => (
                <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    className="rounded-lg bg-gray-100 py-3 text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    {formatRupiah(amount).replace('Rp ', '')}
                </button>
            ))}
        </div>

        {/* Calculator Grid */}
        <div className="grid flex-1 grid-cols-4 gap-2 p-6 pt-0">
            {/* Row 1 */}
            {[7, 8, 9].map((num) => (
                <button
                    key={num}
                    onClick={() => handleNumberClick(num.toString())}
                    className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={handleClear}
                className="rounded-lg bg-red-100 py-4 text-sm font-semibold text-red-600 hover:bg-red-200 active:bg-red-300 transition-colors"
            >
                CLR
            </button>

            {/* Row 2 */}
            {[4, 5, 6].map((num) => (
                <button
                    key={num}
                    onClick={() => handleNumberClick(num.toString())}
                    className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => handleNumberClick('000')}
                className="rounded-lg bg-gray-100 py-4 text-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
                000
            </button>

            {/* Row 3 */}
            {[1, 2, 3].map((num) => (
                <button
                    key={num}
                    onClick={() => handleNumberClick(num.toString())}
                    className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                    {num}
                </button>
            ))}
            <button
                onClick={() => handleNumberClick('00')}
                className="rounded-lg bg-gray-100 py-4 text-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
                00
            </button>

            {/* Row 4 */}
            <button
                onClick={handleExact}
                className="col-span-2 rounded-lg bg-yellow-100 py-4 text-sm font-semibold text-yellow-700 hover:bg-yellow-200 active:bg-yellow-300 transition-colors"
            >
                EXACT
            </button>
            <button
                onClick={() => handleNumberClick('0')}
                className="rounded-lg bg-gray-100 py-4 text-xl font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
            >
                0
            </button>
            <button
                onClick={handleBackspace}
                className="rounded-lg bg-orange-100 py-4 text-sm font-semibold text-orange-700 hover:bg-orange-200 active:bg-orange-300 transition-colors"
            >
                ⌫
            </button>
        </div>

        {/* Complete Button */}
        <div className="border-t p-6">
            <button
                onClick={handleComplete}
                disabled={!canComplete}
                className={`w-full rounded-lg py-4 text-lg font-bold text-white transition-all ${
                    canComplete
                        ? 'bg-green-600 hover:bg-green-700 active:scale-95'
                        : 'cursor-not-allowed bg-gray-300'
                }`}
            >
                {canComplete ? 'Complete Payment' : 'Insufficient Amount'}
            </button>
        </div>
    </div>
);
}