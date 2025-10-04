import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ShoppingCart,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  User,
  Building,
  FileText,
  DollarSign
} from 'lucide-react';

export default function Index({ purchases, suppliers, statuses, filters, auth }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [selectedSupplier, setSelectedSupplier] = useState(filters.supplier_id || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedStatus) params.status = selectedStatus;
    if (selectedSupplier) params.supplier_id = selectedSupplier;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    router.get(route('purchases.index'), params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedSupplier('');
    setDateFrom('');
    setDateTo('');
    router.get(route('purchases.index'));
  };

  const deletePurchase = (purchase) => {
    if (purchase.status !== 'pending') {
      alert('Only pending purchases can be deleted.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete purchase ${purchase.invoice_number}?`)) {
      router.delete(route('purchases.destroy', purchase.id));
    }
  };

  const receivePurchase = (purchase) => {
    if (purchase.status !== 'pending') {
      alert('Only pending purchases can be received.');
      return;
    }

    if (confirm(`Are you sure you want to receive purchase ${purchase.invoice_number}? This will update the stock.`)) {
      router.post(route('purchases.receive', purchase.id));
    }
  };

  const cancelPurchase = (purchase) => {
    if (purchase.status !== 'pending') {
      alert('Only pending purchases can be cancelled.');
      return;
    }

    if (confirm(`Are you sure you want to cancel purchase ${purchase.invoice_number}?`)) {
      router.post(route('purchases.cancel', purchase.id));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'received':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'received': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'pending': 'Pending',
      'received': 'Received',
      'cancelled': 'Cancelled'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status] || status}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const hasActiveFilters = searchTerm || selectedStatus || selectedSupplier || dateFrom || dateTo;

  // Check user permissions
  const canCreate = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canEdit = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canDelete = auth.user.roles.some(role => ['owner', 'manager'].includes(role.name));
  const canReceive = auth.user.roles.some(role => ['owner', 'manager', 'staff'].includes(role.name));

  return (
    <AppLayout title="Purchases">
      <Head title="Purchases" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
              <p className="text-gray-500 mt-1">
                Manage your purchase orders ({purchases.total} records)
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
              {canCreate && (
                <Link
                  href={route('purchases.create')}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  New Purchase
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Invoice
                  </label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by invoice number..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier
                  </label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Suppliers</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
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

        {/* Purchases Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {purchases.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.data.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <ShoppingCart size={18} className="text-emerald-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {purchase.invoice_number}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{purchase.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building size={14} className="mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {purchase.supplier?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {purchase.supplier?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar size={14} className="mr-2 text-gray-400" />
                            {formatDate(purchase.purchase_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm font-medium text-gray-900">
                            <DollarSign size={14} className="mr-1 text-gray-400" />
                            {formatCurrency(purchase.total_amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(purchase.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <User size={14} className="mr-2 text-gray-400" />
                            <div>
                              <div>{purchase.user?.name}</div>
                              <div className="text-xs text-gray-500">
                                {formatDate(purchase.created_at)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={route('purchases.show', purchase.id)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link>
                            
                            {purchase.status === 'pending' && canReceive && (
                              <button
                                onClick={() => receivePurchase(purchase)}
                                className="text-gray-400 hover:text-green-600 p-1"
                                title="Receive Purchase"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}

                            {purchase.status === 'pending' && canEdit && (
                              <Link
                                href={route('purchases.edit', purchase.id)}
                                className="text-gray-400 hover:text-emerald-600 p-1"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </Link>
                            )}

                            {purchase.status === 'pending' && canDelete && (
                              <>
                                <button
                                  onClick={() => cancelPurchase(purchase)}
                                  className="text-gray-400 hover:text-red-600 p-1"
                                  title="Cancel"
                                >
                                  <XCircle size={16} />
                                </button>
                                <button
                                  onClick={() => deletePurchase(purchase)}
                                  className="text-gray-400 hover:text-red-600 p-1"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {purchases.links && purchases.links.length > 3 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      {purchases.prev_page_url && (
                        <Link
                          href={purchases.prev_page_url}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Previous
                        </Link>
                      )}
                      {purchases.next_page_url && (
                        <Link
                          href={purchases.next_page_url}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{purchases.from}</span> to{' '}
                          <span className="font-medium">{purchases.to}</span> of{' '}
                          <span className="font-medium">{purchases.total}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {purchases.links.map((link, index) => (
                            <Link
                              key={index}
                              href={link.url || '#'}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                link.active
                                  ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                                  : link.url
                                  ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  : 'bg-gray-100 border-gray-300 text-gray-300 cursor-not-allowed'
                              } ${
                                index === 0 ? 'rounded-l-md' : ''
                              } ${
                                index === purchases.links.length - 1 ? 'rounded-r-md' : ''
                              }`}
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
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search terms.'
                  : "No purchases have been created yet."
                }
              </p>
              {!hasActiveFilters && canCreate && (
                <Link
                  href={route('purchases.create')}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Create First Purchase
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Notes Section for purchases with notes */}
        {purchases.data.some(purchase => purchase.notes) && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <FileText size={16} className="mr-2" />
              Recent Notes:
            </h4>
            <div className="space-y-2">
              {purchases.data.filter(purchase => purchase.notes).slice(0, 3).map(purchase => (
                <div key={purchase.id} className="text-sm text-blue-800">
                  <span className="font-medium">{purchase.invoice_number}:</span> {purchase.notes}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}