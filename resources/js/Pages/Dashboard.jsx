import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, recent_sales }) {
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <div className="text-sm font-medium text-gray-500">Today Sales</div>
                        <div className="mt-2 text-3xl font-bold text-indigo-600">
                            {formatRupiah(stats.today_sales)}
                        </div>
                    </Card>

                    <Card>
                        <div className="text-sm font-medium text-gray-500">Transactions</div>
                        <div className="mt-2 text-3xl font-bold text-green-600">
                            {stats.today_transactions}
                        </div>
                    </Card>

                    <Card>
                        <div className="text-sm font-medium text-gray-500">Low Stock</div>
                        <div className="mt-2 text-3xl font-bold text-red-600">
                            {stats.low_stock_products}
                        </div>
                    </Card>

                    <Card>
                        <div className="text-sm font-medium text-gray-500">Total Products</div>
                        <div className="mt-2 text-3xl font-bold text-blue-600">
                            {stats.total_products}
                        </div>
                    </Card>
                </div>

                {/* Recent Sales */}
                <Card title="Recent Sales">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Cashier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {recent_sales && recent_sales.length > 0 ? (
                                    recent_sales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {sale.invoice}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {sale.customer?.name || '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {sale.user?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {formatRupiah(sale.total)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(sale.sale_date).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No recent sales
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}