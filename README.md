# UMKM POS System

Sistem Point of Sale berbasis web yang dikembangkan untuk membantu pelaku UMKM dalam mengelola transaksi penjualan, stok barang, pembelian, dan laporan keuangan sederhana.

Dibangun menggunakan Laravel 12, React 18, dan Inertia.js sebagai bagian dari proyek akhir (skripsi) mahasiswa S1 Sistem Informasi, sekaligus dipersiapkan untuk digunakan langsung oleh client UMKM.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Struktur Database](#struktur-database)
- [Struktur Folder](#struktur-folder)
- [Hak Akses dan Role](#hak-akses-dan-role)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Catatan Pengembangan](#catatan-pengembangan)

---

## Fitur Utama

**Kasir (POS)**
- Antarmuka kasir real-time dengan pencarian produk dan filter kategori
- Pemindai barcode via keyboard input
- Kalkulator pembayaran dengan quick amount buttons
- Dukungan metode pembayaran: tunai, debit, kredit, QRIS, transfer
- Cetak struk otomatis setelah transaksi berhasil

**Manajemen Produk**
- CRUD produk dengan upload gambar
- Kategori produk dengan kode warna
- Manajemen supplier
- Auto-generate SKU jika tidak diisi
- Notifikasi stok minimum

**Stok**
- Pencatatan log stok otomatis setiap transaksi masuk/keluar
- Pembelian barang (purchase order) dengan status pending dan received
- Riwayat perubahan stok per produk

**Penjualan**
- Riwayat transaksi dengan filter tanggal dan pencarian invoice
- Detail transaksi lengkap beserta item dan info pembayaran
- Snapshot nama dan SKU produk saat transaksi (aman meski produk diubah)

**Manajemen Pengguna**
- Multi-user dengan sistem role berbasis permission (Spatie Laravel Permission)
- Tiga role default: Owner, Manager, Cashier
- Owner dapat membuat role kustom dengan permission pilihan

**Dashboard**
- Ringkasan penjualan hari ini
- Jumlah produk stok rendah
- Daftar transaksi terbaru
- Perbandingan penjualan minggu ini vs minggu lalu

---

## Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Backend Framework | Laravel 12 |
| Frontend Framework | React 18 |
| Routing & SSR Bridge | Inertia.js 2 |
| Styling | Tailwind CSS 3 |
| Autentikasi | Laravel Breeze |
| Otorisasi | Spatie Laravel Permission 6 |
| Database (default) | SQLite |
| Database (produksi) | MySQL / MariaDB |
| Build Tool | Vite 7 |
| HTTP Client (frontend) | Axios |
| Notifikasi UI | react-hot-toast |
| Icon | Heroicons |

---

## Persyaratan Sistem

- PHP 8.2 atau lebih baru
- Composer 2
- Node.js 18 atau lebih baru
- NPM 9 atau lebih baru
- SQLite (development) atau MySQL 8 / MariaDB 10.4 (production)

---

## Instalasi

**1. Clone repository**

```bash
git clone https://github.com/username/umkm-pos.git
cd umkm-pos
```

**2. Install dependensi PHP**

```bash
composer install
```

**3. Install dependensi Node.js**

```bash
npm install
```

**4. Salin file konfigurasi**

```bash
cp .env.example .env
```

**5. Generate application key**

```bash
php artisan key:generate
```

**6. Jalankan migrasi dan seeder**

```bash
php artisan migrate --seed
```

**7. Buat symlink storage**

```bash
php artisan storage:link
```

**8. Jalankan server development**

```bash
composer run dev
```

Perintah di atas akan menjalankan Laravel server, queue worker, log watcher, dan Vite secara bersamaan.

Akses aplikasi di `http://localhost:8000`.

---

## Konfigurasi

**Database**

Secara default aplikasi menggunakan SQLite. Untuk beralih ke MySQL, ubah bagian berikut di file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=umkm_pos
DB_USERNAME=root
DB_PASSWORD=password
```

**Timezone**

Untuk penggunaan di Indonesia, ubah timezone di `config/app.php`:

```php
'timezone' => 'Asia/Jakarta',
```

**URL Aplikasi**

```env
APP_URL=http://localhost:8000
```

---

## Struktur Database

Berikut tabel-tabel utama dalam sistem beserta fungsinya:

| Tabel | Fungsi |
|---|---|
| `users` | Data pengguna sistem |
| `roles`, `permissions` | Sistem role dan permission (Spatie) |
| `categories` | Kategori produk |
| `suppliers` | Data supplier |
| `products` | Data produk dan stok |
| `customers` | Data pelanggan |
| `sales` | Header transaksi penjualan |
| `sale_items` | Detail item per transaksi |
| `purchases` | Header pembelian barang |
| `purchase_items` | Detail item per pembelian |
| `stock_logs` | Log setiap perubahan stok |
| `settings` | Konfigurasi aplikasi |

Setiap transaksi penjualan menyimpan snapshot `product_name` dan `product_sku` di tabel `sale_items`, sehingga riwayat transaksi tetap akurat meski data produk diubah atau dihapus di kemudian hari.

---

## Struktur Folder

```
app/
  Http/
    Controllers/        # Controller utama (POS, Products, Sales, dll)
    Middleware/         # CheckRole, HandleInertiaRequests
  Models/               # Eloquent models

database/
  migrations/           # Skema tabel
  seeders/              # Data awal (roles, users, produk contoh)

resources/
  js/
    Components/         # Komponen UI yang dapat digunakan ulang
      POS/              # Komponen khusus halaman kasir
    Hooks/              # Custom React hooks
    Layouts/            # Layout halaman (AuthenticatedLayout, CashierLayout)
    Pages/              # Halaman Inertia per fitur
    utils/              # Helper functions (printer, toast)

routes/
  web.php               # Route halaman dengan middleware permission
  api.php               # Route API untuk POS (search, barcode, summary)
  auth.php              # Route autentikasi
```

---

## Hak Akses dan Role

Sistem memiliki tiga role default yang tidak dapat dihapus:

**Owner**
Akses penuh ke seluruh sistem termasuk manajemen role dan pengaturan aplikasi.

**Manager**
Dapat mengelola produk, stok, penjualan, pembelian, pelanggan, supplier, dan melihat laporan. Tidak dapat mengelola role.

**Cashier**
Hanya dapat mengakses halaman POS, melihat daftar produk, dan mengelola pelanggan.

Role kustom dapat dibuat oleh Owner melalui menu Roles dengan memilih permission secara granular.

**Akun Default (Seeder)**

| Email | Password | Role |
|---|---|---|
| owner@pos.com | password | Owner |
| manager@pos.com | password | Manager |
| cashier@pos.com | password | Cashier |

Ganti password akun-akun ini segera setelah instalasi di lingkungan produksi.

---

## Panduan Penggunaan

**Memulai Transaksi di POS**

1. Login sebagai Cashier atau role dengan permission `create sales`
2. Buka menu POS dari sidebar
3. Klik produk untuk menambahkan ke keranjang, atau gunakan kolom pencarian
4. Atur jumlah item di keranjang jika diperlukan
5. Pilih pelanggan (opsional) dan metode pembayaran
6. Klik "Process Payment"
7. Masukkan nominal uang yang diterima di kalkulator pembayaran
8. Klik "Complete Payment" untuk menyelesaikan transaksi
9. Struk akan tampil dan dapat dicetak

**Menambah Produk Baru**

1. Buka menu Products
2. Klik "Add Product"
3. Isi informasi dasar, harga beli, harga jual, stok awal, dan stok minimum
4. Upload gambar produk (opsional, maks 2MB)
5. Simpan

**Menerima Pembelian Barang**

1. Buka menu Purchases dan buat purchase order baru
2. Pilih supplier dan tambahkan item beserta harga beli
3. Simpan sebagai status "Pending"
4. Saat barang tiba, buka detail purchase dan klik "Receive"
5. Stok produk akan otomatis bertambah dan tercatat di stock log

---

## Catatan Pengembangan

**Hal yang sudah selesai**
- Core POS dengan transaksi, stok otomatis, dan cetak struk
- Manajemen produk, kategori, supplier, pelanggan
- Sistem pembelian barang dengan stock log
- Role-based access control granular
- Dashboard dengan statistik ringkas
- Sidebar collapsible dengan animasi smooth

**Hal yang masih perlu dikerjakan**
- Halaman laporan penjualan (route sudah ada, controller dan halaman belum)
- Halaman Settings untuk konfigurasi nama toko, pajak, dll
- React pages untuk Sales Index/Show, Purchases Index/Show/Create, Stock Logs
- Validasi user `is_active` saat login
- Export laporan ke PDF atau Excel
- Grafik penjualan di dashboard

**Keputusan teknis yang perlu diketahui**

Aplikasi menggunakan Inertia.js sehingga tidak ada API terpisah untuk kebutuhan halaman — data dikirim langsung dari controller ke komponen React melalui props. API route (`routes/api.php`) hanya digunakan untuk kebutuhan real-time di halaman POS seperti pencarian produk, scan barcode, dan summary harian.

Transaksi penjualan di `PosController` menggunakan `DB::transaction` dengan `lockForUpdate` untuk mencegah race condition pada stok saat ada kasir yang bertransaksi bersamaan.

---

## Lisensi

Proyek ini dikembangkan untuk keperluan akademik dan penggunaan internal UMKM. Tidak untuk didistribusikan secara komersial tanpa izin.