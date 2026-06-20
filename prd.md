# Product Requirements Document (PRD)
## POS & Inventory Management System — FEE Massage Group

| | |
|---|---|
| **Version** | 1.0 |
| **Status** | Draft for Development |
| **Platform** | Web App (PWA) |
| **Target Device** | Android Tablet, Windows PC |

---

## 1. Product Overview

Sistem Point of Sale (POS) dan Inventory Management berbasis cloud untuk mengelola operasional **14 cabang FEE Massage**. Sistem ini:

- Memisahkan akses data secara **ketat per cabang**
- Mencatat seluruh transaksi penjualan
- Melacak pergerakan stok secara real-time
- Memudahkan proses **stock opname**
- Memiliki manajemen kedaluwarsa barang (expired tracking)
- Menyediakan dashboard sentral bagi manajemen untuk memantau performa bisnis seluruh cabang

### Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | Next.js |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Security | Row Level Security (RLS) |
| Deployment | Vercel (Frontend) + Supabase (Backend) |

---

## 2. Business Goals

1. Membatasi visibilitas kasir agar hanya dapat mengakses data outlet sendiri.
2. Menyediakan manajemen dengan akses pemantauan seluruh data outlet dalam satu dashboard.
3. Mengurangi kehilangan/selisih stok akibat pencatatan manual.
4. Mendeteksi stok minimum dan barang mendekati expired sedini mungkin.
5. Memudahkan komparasi performa dan tren penjualan antar outlet.

---

## 3. User Roles

### 3.1 Kasir

**Diizinkan:**
- Login menggunakan email & password spesifik per akun cabang
- Membuat dan menyimpan transaksi penjualan
- Melihat transaksi dan stok cabangnya sendiri
- Melihat peringatan barang yang akan expired dalam waktu dekat

**Dilarang:**
- Melihat atau memodifikasi data cabang lain
- Mengubah stok persediaan secara manual (kecuali via input transaksi)
- Mengakses laporan dashboard gabungan semua cabang

### 3.2 Admin / Management

**Diizinkan:**
- Akses penuh (bypass policy) untuk melihat seluruh aktivitas cabang
- Mengakses dashboard pusat dan mencetak laporan (gabungan atau per cabang)
- Menambah persediaan (barang masuk) dan mengurangi persediaan (barang keluar)
- Melakukan penyesuaian persediaan fisik via modul Stock Opname
- Mengelola daftar produk (harga, kategori, dll) dan pengguna sistem

---

## 4. Branch Master Data

| ID | Nama Cabang |
|---|---|
| 1 | FEE KELAPA GADING |
| 2 | FEE SUNTER |
| 3 | FEE HARMONI |
| 4 | FEE GREEN GARDEN |
| 5 | FEE SIGNATURE |
| 6 | FEE KEDOYA |
| 7 | FEE MERUYA |
| 8 | FEE PIK |
| 9 | FEE PALEM |
| 10 | FEE PURI |
| 11 | FEE GLC |
| 12 | FEE LITE |
| 13 | FEE ALAM SUTERA |
| 14 | FEE GADING SERPONG |

---

## 5. Functional Requirements

### Module A — Authentication
- User login melalui email & password.
- Sesi dikelola aman dengan token JWT Supabase Auth.
- Kasir otomatis diarahkan hanya ke antarmuka cabang yang berelasi dengan akunnya.

### Module B — POS Transaction
- Kasir menginput layanan/produk, jumlah barang (Qty), dan memilih metode pembayaran (Cash, QRIS, Transfer, Debit).
- Sistem menghitung subtotal dan total harga secara dinamis.
- Sistem menyimpan data invoice, otomatis memotong stok untuk produk bertipe barang fisik, dan menyediakan opsi cetak struk.

### Module C — Inventory
- Admin dapat menambahkan mutasi **Stock In** (contoh: Lulur +20 pcs).
- Admin dapat menambahkan mutasi **Stock Out** dengan keterangan spesifik (barang rusak, barang hilang, mutasi ke cabang lain).

### Module D — Stock Opname
- Admin melakukan verifikasi aset fisik di cabang.
- Wajib mengisi: **Product, Stock System, Stock Actual, Selisih, Keterangan**.

### Module E — Expired Management
- Pencatatan stok wajib menyertakan **Batch Number, Tanggal Masuk, Expired Date**.
- Indikator warna kedaluwarsa:

| Rentang | Warna |
|---|---|
| H-30 | Biru |
| H-14 | Kuning |
| H-7 | Orange |
| H-3 | Merah |
| Lewat Kedaluwarsa | Merah Berkedip |

- Notifikasi visual (alarm/badge) muncul di tab kasir dan admin untuk rentang 14 hari, 7 hari, hingga hari tenggat.
- Tabel ringkasan selalu diurutkan dari tenggat waktu terdekat.

---

## 6. Dashboard Requirements

### Dashboard Kasir
- Penjualan dan jumlah transaksi hari ini di cabang tersebut
- Daftar produk dengan status laris (penjualan tertinggi hari ini)
- Peringatan stok menipis berdasarkan batas minimum
- Tabel peringatan barang mendekati kedaluwarsa

### Dashboard Admin
- KPI global: Total Penjualan Hari Ini, Bulan Ini, Total Transaksi, Jumlah Produk
- Grafik & tabel perbandingan penjualan (harian, mingguan, bulanan)
- Tabel peringkat cabang (Top Outlet) berdasarkan omzet
- Tabel produk paling laris (Top Product) dari seluruh outlet

---

## 7. Data Model (Database Schema)

> Seluruh ID tabel menggunakan format UUID.

| Tabel | Kolom Utama | Deskripsi |
|---|---|---|
| `branches` | `id, name, address, created_at` | Direktori identitas cabang operasional |
| `users` | `id, branch_id, name, email, role, created_at` | Data autentikasi. Kolom `branch_id` esensial untuk filter akses |
| `categories` | `id, name` | Kategori barang/jasa |
| `products` | `id, name, category_id, price, is_stocked` | `is_stocked` (boolean) membedakan Jasa vs Barang Fisik |
| `stock` | `id, branch_id, product_id, qty` | Akumulasi inventaris kotor dari seluruh batch |
| `stock_batches` | `id, branch_id, product_id, batch_no, qty, expired_date` | Penjabaran stok berdasarkan nomor batch |
| `stock_movements` | `id, branch_id, product_id, type, qty, note, created_by, created_at` | Histori perpindahan: IN, OUT, ADJUSTMENT, OPNAME |
| `transactions` | `id, invoice_no, branch_id, cashier_id, payment_method, total, created_at` | Pencatatan nominal akhir transaksi per struk |
| `transaction_items` | `id, transaction_id, product_id, qty, price, subtotal` | Rincian satuan barang untuk perhitungan potong stok |

---

## 8. Security Requirements

- **Batasan utama:** pemisahan data **tidak boleh** hanya dieksekusi di sisi frontend (filter UI), karena sangat berisiko dieksploitasi.
- **Implementasi wajib:** Row Level Security (RLS) di Supabase diterapkan pada seluruh skema tabel operasional.
- **Kasir Policy:** sistem hanya melayani kueri SQL jika token JWT pengguna (`auth_user.branch_id`) cocok seutuhnya dengan kolom `branch_id` pada tabel data target.
- **Admin Policy:** pengguna dengan role Admin mendapat bypass policy — bisa Select, Insert, Update data operasional seluruh cabang tanpa batasan `branch_id`.

---

## 9. Reporting & Non-Functional Requirements (NFR)

- Modul ekspor rekap data dalam format **Excel, CSV, dan PDF**.
- Filter laporan: Harian, Mingguan, Bulanan, dan Rentang Kustom (Custom Date).
- **Response Time API**: di bawah 1 detik.
- **Render Dashboard**: di bawah 3 detik.
- **Uptime/Availability**: di atas 99%.
- Seluruh transmisi data dienkripsi dengan **HTTPS**.
- Tersedia **Audit Log** untuk setiap perubahan stok persediaan.
- Antarmuka berjalan optimal sebagai **PWA**: bisa di-install di beranda tablet Android, mendukung fullscreen, touch-friendly, responsif, dan ringan dimuat.

---

## 10. Acceptance Criteria

| # | Test Case | Status |
|---|---|---|
| 1 | Kasir cabang **FEE KELAPA GADING** login dan **gagal total** memuat data transaksi cabang **FEE SUNTER**, termasuk saat mencoba manipulasi endpoint API secara manual. | PASS REQUIRED |
| 2 | Penciptaan pesanan produk barang (non-jasa) di kasir **wajib** dieksekusi bersamaan dengan pemotongan nominal inventori di database. | PASS REQUIRED |
| 3 | Akun Management memuat dashboard utama dan sistem menampilkan kalkulasi data dari ke-14 cabang **tanpa kekeliruan perhitungan**. | PASS REQUIRED |
| 4 | Barang fisik dengan `expired_date` tersisa 14 hari mengaktifkan notifikasi & alarm kuning di layar operasional. | PASS REQUIRED |
| 5 | Pelaksanaan Stock Opname menghasilkan baris baru di histori database yang menjelaskan selisih dan keterangan penyebab selisih barang. | PASS REQUIRED |

---

## 11. Out of Scope (Rencana Fase 2 / ERP Integrasi)

Item berikut **tidak** dikerjakan pada rilis versi awal (Fase 1), untuk menghindari komplikasi berlebihan:

- Integrasi pembayaran otomatis (payment gateway)
- Aplikasi native APK/iOS
- Fitur jam kerja (Check In/Out) beserta kalkulasi komisi terapis
- Program pindai kode rekanan
- Struktur loyalti membership (bonus kunjungan ke-7, ke-n)
- Pengelolaan reservasi/waiting list pelanggan
- Alokasi persediaan multi-gudang dari pangkalan induk ke tiap outlet

> Fase 1 harus dirampungkan sepenuhnya terlebih dahulu sebelum eksekusi Fase 2 dimulai.
