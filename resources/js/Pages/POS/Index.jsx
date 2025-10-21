// ========================================
// FILE: resources/js/Pages/POS/Index.jsx (UPDATE)
// ========================================
import { useState, useEffect } from 'react';
import CashierLayout from '@/Layouts/CashierLayout';
import ProductCard from '@/Components/POS/ProductCard';
import CartItem from '@/Components/POS/CartItem';
import Calculator from '@/Components/POS/Calculator';
import InvoiceModal from '@/Components/POS/InvoiceModal'; 
import Modal from '@/Components/Modal';
import { Head, router } from '@inertiajs/react';
import { 
    MagnifyingGlassIcon, 
    ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function POSIndex({ products, categories, customers }) {
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false); 
    const [completedSale, setCompletedSale] = useState(null); 
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [processing, setProcessing] = useState(false);

    // Initialize products - Backend returns grouped by category.name
    useEffect(() => {
        let allProducts = [];
        if (products && typeof products === 'object') {
            allProducts = Object.values(products).flat();
        }
        setFilteredProducts(allProducts);
    }, [products]);

    // Filter products
    useEffect(() => {
        let result = [];
        if (products && typeof products === 'object') {
            result = Object.values(products).flat();
        }

        if (selectedCategory) {
            result = result.filter(p => p.category_id === selectedCategory);
        }

        if (searchQuery) {
            const search = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(search) ||
                p.sku?.toLowerCase().includes(search) ||
                p.barcode?.toLowerCase().includes(search)
            );
        }

        setFilteredProducts(result);
    }, [searchQuery, selectedCategory, products]);

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            if (existingItem.qty < product.stock) {
                setCart(cart.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                ));
            }
        } else {
            setCart([...cart, {
                id: product.id,
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                price: product.price,
                qty: 1,
                stock: product.stock,
                discount: 0,
            }]);
        }
    };

    const updateCartQty = (itemId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(itemId);
            return;
        }

        const item = cart.find(i => i.id === itemId);
        if (newQty > item.stock) return;

        setCart(cart.map(item =>
            item.id === itemId ? { ...item, qty: newQty } : item
        ));
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setDiscount(0);
        setPaymentMethod('cash');
    };

    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = (subtotal - discount) * 0.11; // 11% PPN
    const total = subtotal - discount + tax;

    const handlePayment = (cashReceived) => {
        setProcessing(true);

        const saleData = {
            payment_method: paymentMethod,
            items: cart.map(item => ({
                product_id: item.product_id,
                qty: item.qty,
                price: item.price,
                discount: item.discount || 0,
            })),
            discount: discount || 0,
            tax_rate: 11,
            cash_received: cashReceived,
        };

        if (selectedCustomer && selectedCustomer.id !== 1) {
            saleData.customer_id = selectedCustomer.id;
        }

        if (paymentMethod !== 'cash') {
            saleData.payment_reference = `${paymentMethod.toUpperCase()}-${Date.now()}`;
        }

        axios.post('/pos/sale', saleData)
            .then(response => {
                // Close calculator
                setShowCalculator(false);
                
                // Set completed sale data
                setCompletedSale(response.data.data);
                
                // Show invoice modal
                setShowInvoice(true);
                
                // Clear cart
                clearCart();
                
                // Refresh products data
                router.reload({ only: ['products'] });
            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'Transaction failed!';
                alert(errorMessage);
                console.error('Transaction error:', error.response?.data);
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handlePrint = (sale) => {
        // Print functionality
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${sale.invoice}</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        margin: 20px;
                        max-width: 300px;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px dashed #000;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                    }
                    .company-name {
                        font-size: 16px;
                        font-weight: bold;
                    }
                    .section {
                        margin-bottom: 10px;
                        border-bottom: 1px dashed #ccc;
                        padding-bottom: 10px;
                    }
                    .row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .items {
                        margin: 10px 0;
                    }
                    .item {
                        margin-bottom: 8px;
                    }
                    .item-name {
                        font-weight: bold;
                    }
                    .item-detail {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                    }
                    .total-section {
                        border-top: 2px solid #000;
                        padding-top: 10px;
                        margin-top: 10px;
                    }
                    .grand-total {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        border-top: 2px dashed #000;
                        padding-top: 10px;
                    }
                    @media print {
                        body { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">POS SYSTEM</div>
                    <div>Jakarta, Indonesia</div>
                    <div>Telp: 021-12345678</div>
                </div>

                <div class="section">
                    <div class="row">
                        <span>Invoice:</span>
                        <span><strong>${sale.invoice}</strong></span>
                    </div>
                    <div class="row">
                        <span>Date:</span>
                        <span>${new Date(sale.sale_date).toLocaleString('id-ID')}</span>
                    </div>
                    ${sale.customer ? `
                    <div class="row">
                        <span>Customer:</span>
                        <span>${sale.customer.name}</span>
                    </div>
                    ` : ''}
                    <div class="row">
                        <span>Cashier:</span>
                        <span>${sale.user?.name || 'N/A'}</span>
                    </div>
                </div>

                <div class="items">
                    ${sale.items?.map(item => `
                        <div class="item">
                            <div class="item-name">${item.product_name}</div>
                            <div class="item-detail">
                                <span>${formatRupiah(item.price)} x ${item.qty}</span>
                                <span>${formatRupiah(item.subtotal)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="total-section">
                    <div class="row">
                        <span>Subtotal:</span>
                        <span>${formatRupiah(sale.subtotal)}</span>
                    </div>
                    ${sale.discount > 0 ? `
                    <div class="row">
                        <span>Discount:</span>
                        <span>-${formatRupiah(sale.discount)}</span>
                    </div>
                    ` : ''}
                    <div class="row">
                        <span>Tax (11%):</span>
                        <span>${formatRupiah(sale.tax)}</span>
                    </div>
                    <div class="row grand-total">
                        <span>TOTAL:</span>
                        <span>${formatRupiah(sale.total)}</span>
                    </div>
                    ${sale.payment_method === 'cash' ? `
                    <div class="row">
                        <span>Cash:</span>
                        <span>${formatRupiah(sale.cash_received)}</span>
                    </div>
                    <div class="row">
                        <span>Change:</span>
                        <span>${formatRupiah(sale.change)}</span>
                    </div>
                    ` : `
                    <div class="row">
                        <span>Payment:</span>
                        <span>${sale.payment_method.toUpperCase()}</span>
                    </div>
                    `}
                </div>

                <div class="footer">
                    <div>Thank you for your purchase!</div>
                    <div>Please come again</div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    };

    const handleCloseInvoice = () => {
        setShowInvoice(false);
        setCompletedSale(null);
    };

    return (
        <CashierLayout>
            <Head title="POS - Cashier" />

            <div className="flex h-full">
                {/* Left Panel - Products */}
                <div className="flex flex-1 flex-col border-r">
                    {/* Search & Categories */}
                    <div className="border-b bg-white p-4">
                        <div className="relative mb-3">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products (name, SKU, barcode)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
                                    !selectedCategory
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
                                        selectedCategory === category.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.name} ({category.products_count})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="flex h-64 items-center justify-center">
                                <p className="text-gray-500">No products found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Cart */}
                <div className="flex w-[450px] flex-col bg-white">
                    {/* Cart Header */}
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingCartIcon className="h-6 w-6 text-indigo-600" />
                                <h2 className="text-lg font-bold">Cart ({cart.length})</h2>
                            </div>
                            {cart.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Customer Selection */}
                        <div className="mt-3">
                            <select
                                value={selectedCustomer?.id || ''}
                                onChange={(e) => {
                                    const customer = customers.find(c => c.id === parseInt(e.target.value));
                                    setSelectedCustomer(customer || null);
                                }}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} {customer.phone && `(${customer.phone})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-300" />
                                    <p className="mt-2 text-gray-500">Cart is empty</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQty={updateCartQty}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    {cart.length > 0 && (
                        <div className="border-t p-4">
                            {/* Discount Input */}
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Discount
                                </label>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="debit">Debit Card</option>
                                    <option value="credit">Credit Card</option>
                                    <option value="qris">QRIS</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                            </div>

                            {/* Totals */}
                            <div className="space-y-2 border-t pt-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatRupiah(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="font-medium text-red-600">-{formatRupiah(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (11%)</span>
                                    <span className="font-medium">{formatRupiah(tax)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-indigo-600">{formatRupiah(total)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => setShowCalculator(true)}
                                disabled={cart.length === 0 || processing}
                                className="mt-4 w-full rounded-lg bg-indigo-600 py-4 text-lg font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {processing ? 'Processing...' : 'Process Payment'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Calculator Modal */}
            <Modal
                show={showCalculator}
                onClose={() => !processing && setShowCalculator(false)}
                maxWidth="lg"
            >
                <Calculator
                    total={total}
                    onComplete={handlePayment}
                    onClose={() => setShowCalculator(false)}
                />
            </Modal>

            {/* Invoice Modal */}
            <InvoiceModal
                show={showInvoice}
                onClose={handleCloseInvoice}
                sale={completedSale}
                onPrint={handlePrint}
            />
        </CashierLayout>    
    );
}