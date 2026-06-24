# Tech Stack - NUSA-BENCH

Dokumentasi teknologi dan keputusan arsitektur yang digunakan dalam pengembangan NUSA-BENCH. Pilihan ini berfokus pada kinerja maksimal (*optimal*), ukuran yang ringan (*lightweight*), serta pengalaman pengguna yang mewah (*premium UX*).

## 1. Frontend Core
*   **Vite + React (JavaScript):**
    *   Vite digunakan untuk *scaffolding* dan *build tool* karena kecepatan *HMR* (Hot Module Replacement) yang luar biasa dan ukuran berkas bundel yang sangat kecil.
    *   React digunakan untuk mengelola state interaktif pada Kalkulator Proyek dan Dashboard secara dinamis.

## 2. Backend API Server
*   **Node.js + Express:**
    *   Menggunakan server web Node.js yang ringan dengan framework Express untuk menangani permintaan HTTP secara asinkron.
    *   Dikonfigurasi menggunakan ES Modules asli (`"type": "module"`) dan middleware `cors` untuk mengizinkan permintaan dari lintas asal port frontend (Vite port 5173).

## 3. Database & Persistence
*   **Local File Storage Database (JSON):**
    *   Data disimpan secara persisten di sisi server backend di dalam berkas [backend/data/db.json](file:///C:/Users/HYPE%20AMD/files/belajar%20koding/NUSA-BENCH/backend/data/db.json).
    *   Server secara otomatis menginisialisasi berkas JSON dengan skema default jika berkas tersebut tidak ditemukan pada saat pemuatan awal.

## 4. Desain & UI Styling (Vanilla CSS)
*   **Pure Custom Vanilla CSS:**
    *   Mengikuti pedoman teknis untuk memaksimalkan fleksibilitas, kontrol penuh, dan performa pemuatan yang cepat.
    *   **CSS Custom Properties (Variables):** Digunakan untuk sistem token warna HSL (Tema Gelap Premium), ukuran font, radius sudut (*border-radius*), dan bayangan (*shadows*).
    *   **Glassmorphism & Bento Grid Layout:** Menghadirkan UI yang terasa modern dan hidup dengan memanfaatkan `backdrop-filter`, grid dua dimensi, dan gradien halus.
    *   **Mikro-Animasi:** Menggunakan transisi CSS murni dengan kurva *cubic-bezier* berdurasi 150-300ms untuk mensimulasikan gerakan alami (*spring physics*).

## 5. Pustaka Pihak Ketiga (Ringan & Aman)
*   **goey-toast (Toast Notifications):**
    *   Pustaka default untuk menampilkan toast notifikasi interaktif berbentuk morphing gooey blob.
    *   Diintegrasikan dengan `framer-motion` untuk menggerakkan elemen notifikasi secara halus.
*   **lucide-react (Icons):**
    *   Pustaka ikon SVG modular berbasis ES modules yang mempermudah teknik *tree-shaking* agar bundel akhir tetap sangat ringan.
*   **framer-motion (Animations):**
    *   Digunakan secara minimalis untuk mendukung notifikasi toast dan transisi state dashboard.

## 6. Keamanan & Optimasi
*   **Keamanan Input:** Penggunaan validasi tipe data React state, validasi format surel Regex di server backend, dan pencegahan injeksi script (`innerHTML` dihindari; lebih memilih `textContent` atau binding variabel React standar).
*   **Aksesibilitas (a11y):** Teks memiliki rasio kontras tinggi, elemen interaktif menggunakan tombol `<button>` dengan `aria-label` yang sesuai, dan status fokus keyboard (`:focus-visible`) yang jelas.
*   **Performa & CLS:** Penentuan dimensi media (`width` dan `height`) secara eksplisit, pemuatan font Google Fonts (Inter & Outfit) yang teroptimasi, serta struktur kode modular untuk meminimalkan re-rendering.
