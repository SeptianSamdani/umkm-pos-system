import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-indigo-600">POS System</h1>
                    <p className="mt-4 text-xl text-gray-600">Point of Sale Management System</p>
                    
                    <div className="mt-8 space-x-4">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg border border-indigo-600 px-6 py-3 text-indigo-600 hover:bg-indigo-50"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}