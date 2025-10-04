// resources/js/Pages/Sales/Index.jsx

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye,
  Receipt,
  FileText
} from 'lucide-react';

export default function Index({ sales, filters }) {
  const [showFilters, setShowFilters] = useState(false);

  // Menggunakan satu state object untuk semua filter
  const [filterValues, setFilterValues] = useState({
    search: filters.search || '',
    date_from: filters.date_from || '',
    date_to: filters.date_to || '',
    status: filters.status || '',
  });

  // Update state jika prop filter berubah (misalnya saat navigasi back/forward)
  useEffect(() => {
    setFilterValues({
      search: filters.search || '',
      date_from: filters.date_from || '',
      date_to: filters.date_to || '',
      status: filters.status || '',
    });
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    
    // Hapus parameter filter yang kosong sebelum mengirim request
    const queryParams = Object.fromEntries(
      Object.entries(filterValues).filter(([_, v]) => v !== '')
    );

    router.get(route('sales.index'), queryParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setFilterValues({ search: '', date_from: '', date_to: '', status: '' });
    router.get(route('sales.index'));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'text-green-700 bg-green-50', label: 'Completed' };
      case 'refunded':
        return { color: 'text-gray-700 bg-gray-100', label: 'Refunded' };
      case 'pending':
        return { color: 'text-yellow-700 bg-yellow-50', label: 'Pending' };
      default:
        return { color: 'text-gray-700 bg-gray-50', label: status };
    }
  };

  const hasActiveFilters = Object.values(filterValues).some(v => v !== '');

  return (
    <AppLayout title="Sales Transactions">
      <Head title="Sales Transactions" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Transactions</h1>
              <p className="text-gray-500 mt-1">
                View and manage all sales history ({sales.total} transactions)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                  hasActiveFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Filter size={16} className="mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
              <Link
                href={route('sales.create')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} className="mr-2" />
                New Sale
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={applyFilters} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Invoice #
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      value={filterValues.search}
                      onChange={handleFilterChange}
                      placeholder="INV-..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="date_from"
                    value={filterValues.date_from}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="date_to"
                    value={filterValues.date_to}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filterValues.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {sales.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.data.map((sale) => {
                      const statusInfo = getStatusBadge(sale.status);
                      return (
                        <tr key={sale.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                            {sale.invoice_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {formatDate(sale.sale_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {sale.customer?.name || <span className="text-gray-400">Walk-in</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {sale.user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(sale.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={route('sales.show', sale.id)}
                              className="inline-flex items-center text-gray-400 hover:text-blue-600 p-1"
                              title="View Details"
                            >
                              <Eye size={16} />
                              <span className="sr-only">View</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {sales.links && sales.links.length > 3 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {sales.prev_page_url && <Link href={sales.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</Link>}
                      {sales.next_page_url && <Link href={sales.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</Link>}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{sales.from}</span> to <span className="font-medium">{sales.to}</span> of <span className="font-medium">{sales.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {sales.links.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url || '#'}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                link.active ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' :
                                link.url ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' :
                                'bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed'
                              } ${index === 0 ? 'rounded-l-md' : ''} ${index === sales.links.length - 1 ? 'rounded-r-md' : ''}`}
                              dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms.'
                  : "You haven't made any sales yet."
                }
              </p>
              {!hasActiveFilters && (
                <Link
                  href={route('sales.create')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Create Your First Sale
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}