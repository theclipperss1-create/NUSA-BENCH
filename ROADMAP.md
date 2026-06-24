# Project Roadmap - NUSA-BENCH

Rencana tahapan pengembangan proyek NUSA-BENCH dari inisialisasi hingga siap untuk produksi.

## Tahap 1: Fondasi & Sistem Desain (Selesai)
*   [x] Inisialisasi Proyek menggunakan Vite + React.
*   [x] Instalasi dependensi vital (`goey-toast`, `framer-motion`, `lucide-react`).
*   [x] Pembuatan dokumentasi perencanaan komprehensif (`PRD.md`, `TECH_STACK.md`, `UI_SPEC.md`, dll.).
*   [x] Konfigurasi token CSS global dan variabel HSL di `src/index.css`.

## Tahap 2: Pengembangan Komponen Utama (Sedang Berjalan)
*   [ ] Pembuatan navigasi glassmorphic (`Navbar.jsx`).
*   [ ] Implementasi Bento Grid untuk pameran layanan inovatif (`BentoServices.jsx`).
*   [ ] Pengembangan Kalkulator Proyek interaktif dengan simulasi biaya waktu nyata (`Estimator.jsx`).
*   [ ] Pembuatan formulir pemesanan yang aman dengan notifikasi Morphing Gooey Toast (`BookingForm.jsx`).

## Tahap 3: State Management & Layanan Data
*   [ ] Pembuatan global context (`ProjectContext.jsx`) untuk membagikan data antar komponen.
*   [ ] Implementasi simulasi API asinkron dengan delay realistis di `src/services/api.js`.
*   [ ] Integrasi LocalStorage untuk memelihara sesi pengguna dan daftar pesanan.

## Tahap 4: Dashboard Klien & Uji Coba UI
*   [ ] Pembuatan dashboard pemantauan proyek interaktif (`Dashboard.jsx`).
*   [ ] Implementasi visual progres pengerjaan (lini masa tugas).
*   [ ] Fitur simulasi pembayaran invoice menggunakan sistem notifikasi transisi state.
*   [ ] Optimasi responsivitas mobile-first dan audit kontras warna (a11y).

## Tahap 5: Distribusi & Optimasi Produksi
*   [ ] Pembersihan kode, penataan format melalui ESLint.
*   [ ] Build produksi untuk memverifikasi kebersihan berkas keluaran (*bundle size*).
*   [ ] Publikasi portofolio NUSA-BENCH.
