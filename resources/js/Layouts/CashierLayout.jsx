// ========================================
// FILE: resources/js/Layouts/CashierLayout.jsx
// ========================================
import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    HomeIcon, 
    ClockIcon, 
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

export default function CashierLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(false);
    const [summary, setSummary] = useState({ transactions: 0, total_sales: 0 });
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch today's summary
    useEffect(() => {
        fetchSummary();
        const interval = setInterval(fetchSummary, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    // Update clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Flash messages
    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 3000);
        }
    }, [flash]);

    const fetchSummary = async () => {
        try {
            const response = await axios.get('/api/pos/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        fontWeight: '500',
                        zIndex: 9999, 
                    },
                    success: {
                        style: {
                            background: '#10b981',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#10b981',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                        },
                        iconTheme: {
                            primary: '#fff',
                            secondary: '#ef4444',
                        },
                    },
                    loading: {
                        style: {
                            background: '#f59e0b',
                        },
                    },
                }}
            />
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-indigo-600">POS System</h1>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                            {currentTime.toLocaleTimeString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Today's Stats */}
                    <div className="flex gap-6">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Transactions</p>
                            <p className="text-lg font-bold text-gray-900">{summary.transactions}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Today's Sales</p>
                            <p className="text-lg font-bold text-green-600">
                                {formatRupiah(summary.total_sales)}
                            </p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 border-l pl-6">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">
                                {auth.user.roles?.[0] || 'Cashier'}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            <Link
                                href="/dashboard"
                                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                                title="Dashboard"
                            >
                                <HomeIcon className="h-5 w-5" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                title="Logout"
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Flash Messages */}
            {showFlash && (flash.success || flash.error) && (
                <div className="fixed right-6 top-20 z-50 w-96">
                    <div
                        className={`rounded-lg p-4 shadow-lg ${
                            flash.success
                                ? 'bg-green-50 text-green-800'
                                : 'bg-red-50 text-red-800'
                        }`}
                    >
                        <p className="font-medium">{flash.success || flash.error}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}