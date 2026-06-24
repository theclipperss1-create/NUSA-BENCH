# Simulated API Specs - NUSA-BENCH

Platform NUSA-BENCH beroperasi dengan mensimulasikan panggilan API asinkron (*mock API calls*) untuk mempercepat pemuatan halaman serta menyederhanakan uji coba tanpa memerlukan server backend terpisah.

Berikut adalah spesifikasi antarmuka API simulasi yang diimplementasikan di sisi frontend (`src/services/api.js`):

## 1. Layanan Pemesanan Proyek (Project Services)

### `GET /api/projects`
Mengambil semua proyek aktif yang disimpan di penyimpanan lokal.
*   **Response (Success):** `200 OK`
    *   Mengembalikan daftar objek proyek (seperti terinci di `DATABASE.md`).

### `POST /api/projects/create`
Membuat pesanan proyek baru berdasarkan data dari Kalkulator Estimasi.
*   **Request Body:**
    ```json
    {
      "title": "Aplikasi Toko Online",
      "platform": "Web Mobile Only",
      "complexity": "Minimalis",
      "features": ["Authentication", "Cart System"],
      "estimatedCost": 35000000,
      "estimatedDuration": 21
    }
    ```
*   **Response (Success):** `201 Created`
    ```json
    {
      "success": true,
      "message": "Project booking successfully created.",
      "project": { ... }
    }
    ```

## 2. Layanan Tagihan & Keuangan (Billing Services)

### `GET /api/invoices`
Mengambil daftar semua tagihan terkait proyek yang aktif.
*   **Response (Success):** `200 OK`
    *   Mengembalikan array objek invoice.

### `POST /api/invoices/:id/pay`
Simulasi melakukan pembayaran invoice.
*   **Response (Success):** `200 OK`
    ```json
    {
      "success": true,
      "message": "Invoice paid successfully.",
      "invoiceId": "inv_2026_002",
      "status": "Paid",
      "paidAt": "2026-06-21T15:30:00Z"
    }
    ```

## 3. Layanan Autentikasi (Mock Authentication)

### `POST /api/auth/login`
Simulasi masuk ke dashboard klien menggunakan email.
*   **Request Body:**
    ```json
    {
      "email": "demo@NUSA-BENCH.id"
    }
    ```
*   **Response (Success):** `200 OK`
    ```json
    {
      "success": true,
      "token": "simulated_jwt_token_xyz123",
      "client": {
        "clientName": "Client Demo NUSA-BENCH",
        "email": "demo@NUSA-BENCH.id"
      }
    }
    ```

## 4. Penanganan Keterlambatan Jaringan (Simulated Network Latency)
Untuk mensimulasikan lingkungan server dunia nyata yang sesungguhnya:
*   Setiap pemanggilan fungsi API akan dibungkus di dalam `Promise` dengan delay acak antara `400ms` hingga `1200ms` menggunakan `setTimeout`.
*   Selama pemrosesan API berlangsung, notifikasi pemuatan menggunakan tracker `gooeyToast.promise` akan ditampilkan secara visual kepada pengguna.
