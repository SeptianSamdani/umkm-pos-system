import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 3000);
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar user={auth.user} />
            <Header user={auth.user} />

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
                        <p className="font-medium">
                            {flash.success || flash.error}
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="ml-64 pt-16">
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}