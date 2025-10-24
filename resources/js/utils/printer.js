// resources/js/utils/printer.js

export const printReceipt = (sale, companyInfo = {}) => {
    // Check if printing is supported
    if (!window.print) {
        throw new Error('Printing is not supported in this browser');
    }

    const printContent = generateReceiptHTML(sale, companyInfo);
    
    // Create iframe for printing (better than popup)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();
    
    // Wait for content to load
    iframe.onload = () => {
        try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Clean up after printing
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 100);
        } catch (e) {
            console.error('Print failed:', e);
            document.body.removeChild(iframe);
            throw new Error('Failed to print receipt');
        }
    };
};

const generateReceiptHTML = (sale, companyInfo) => {
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Invoice ${sale.invoice}</title>
            <style>
                @media print {
                    @page { margin: 0; size: 80mm auto; }
                    body { margin: 0; }
                }
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    margin: 0;
                    padding: 10mm;
                    max-width: 80mm;
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
                    margin-bottom: 5px;
                }
                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                .section {
                    margin-bottom: 10px;
                    border-bottom: 1px dashed #ccc;
                    padding-bottom: 10px;
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
            </style>
        </head>
        <body>
            <div class="header">
                <div class="company-name">${companyInfo.name || 'POS SYSTEM'}</div>
                <div>${companyInfo.address || 'Jakarta, Indonesia'}</div>
                <div>Telp: ${companyInfo.phone || '021-12345678'}</div>
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

            <div class="section">
                ${sale.items?.map(item => `
                    <div style="margin-bottom: 8px;">
                        <div style="font-weight: bold;">${item.product_name}</div>
                        <div class="row" style="font-size: 11px;">
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
        </body>
        </html>
    `;
};