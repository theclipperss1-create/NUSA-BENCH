# 🇮🇩 NUSA-BENCH — Platform Kustom Agensi IT Premium (Full-Stack)

[![React Version](https://img.shields.io/badge/React-19.2-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![Vite Bundler](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Express Backend](https://img.shields.io/badge/Express-4.21-green.svg?logo=express&logoColor=white)](https://expressjs.com)
[![Supabase DB](https://img.shields.io/badge/Supabase-Enabled-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![Security Audited](https://img.shields.io/badge/Security-Helmet%20%26%20Rate%20Limit-red.svg?logo=auth0&logoColor=white)](#-prioritas-keamanan-security-first)

**NUSA-BENCH** adalah platform kustom full-stack premium yang dirancang khusus untuk agensi pengembangan software kelas atas. Platform ini menggabungkan antarmuka **Bento Grid** modern, **Kalkulator Estimasi Proyek** interaktif, **Form Pemesanan Layanan** terintegrasi, serta **Papan Peringkat Kognitif Nasional** untuk menguji ketangkasan mental pengguna (benchmark otak) dengan visualisasi data real-time.

---

## 🎨 Keunggulan Desain & Pengalaman Pengguna (UI/UX)

*   **Bento Grid Layout:** Menggunakan tata letak bento grid responsif yang modern untuk memetakan kategori layanan agensi.
*   **Tipografi Berkarakter:** Menghindari font standar browser dengan mengintegrasikan font premium yang berkarakter kuat dan profesional.
*   **Aksen Liquid Glassmorphism:** Kombinasi `backdrop-blur` premium dengan batas border transparan halus (`border-white/10`) memberikan efek visual kedalaman yang mewah.
*   **Tanpa AI Slop (Bebas Klise):** Tidak menggunakan visual generik murahan atau copywriting klise AI. Semua konten, interaksi, dan tata letak dirancang presisi dengan skema warna HSL yang harmonis.
*   **Mikro-Animasi Responsif:** Setiap tombol, input, dan panel didukung oleh transisi transisi halus berbasis kurva fisika (*spring physics*) untuk interaksi yang terasa hidup.

---

## 🔒 Prioritas Keamanan (Security-First)

Untuk portofolio produksi ini, keamanan diimplementasikan secara berlapis dari sisi server hingga client untuk mencegah eksploitasi:

1.  **Proteksi Header Keamanan (Helmet):** Mengintegrasikan `helmet` middleware pada Express untuk menyetel berbagai header HTTP keamanan (XSS Protection, Content Security Policy, Clickjacking protection, dll.).
2.  **Pencegahan DDoS & Bruteforce (Rate Limiter):** Membatasi frekuensi request dari IP yang sama secara dinamis menggunakan `express-rate-limit` (maksimum 200 request per 15 menit).
3.  **Sanitasi & Validasi Input Ketat (Zod):** Semua payload input seperti pendaftaran, pembaruan profil, dan pengiriman skor divalidasi dengan skema Zod di sisi backend:
    *   *Username validation:* Hanya mengizinkan karakter alfanumerik, garis bawah, dan tanda hubung (`^[a-zA-Z0-9_-]+$`) untuk mencegah Stored XSS payload.
    *   *Score bounds check:* Membatasi nilai skor masuk hanya berupa angka positif rasional untuk mencegah manipulasi data leaderboard.
4.  **CORS Aman:** Konfigurasi Cross-Origin Resource Sharing yang dinamis hanya memperbolehkan akses origin terdaftar (misalnya frontend client lokal di port 5173/5174 atau URL produksi yang dikonfigurasi melalui `.env`).
5.  **Isolasi Kunci Kredensial:** Seluruh kredensial sensitif seperti *Supabase Service Role Key* dan *Database Connection String* diisolasi penuh di file `.env` lokal dan secara otomatis dikecualikan dari Git melalui `.gitignore`.

---

## 📂 Arsitektur Folder Proyek

```
NUSA-BENCH/
├── frontend/                 # Aplikasi Antarmuka (Vite + React 19)
│   ├── src/
│   │   ├── components/       # Komponen modular (BentoServices, Estimator, Navbar, Modal)
│   │   ├── context/          # State management global (Auth & Proyek)
│   │   ├── services/         # Pemanggilan API Axios menuju Backend
│   │   ├── pages/            # Halaman utama (Dashboard, Leaderboard, Login, Profile)
│   │   └── index.css         # Desain sistem token CSS & variabel HSL
│   └── package.json
│
├── backend/                  # Server Logika API (Node.js + Express)
│   ├── config/               # Inisialisasi Supabase (Simulasi DB & Real DB mode)
│   ├── controllers/          # Logika bisnis (Score & Profile controller)
│   ├── middleware/           # Proteksi rute (Auth JWT Guard)
│   ├── data/                 # Folder basis data simulasi lokal (db.json)
│   ├── routes/               # Handler router API v1
│   ├── app.js                # Konfigurasi middleware utama Express
│   └── package.json
│
├── .env.example              # Template variabel lingkungan untuk kolaborator
└── .gitignore                # Pengecualian file sensitif secara rekursif (.env, .antigravity, dll.)
```

---

## ⚡ Cara Menjalankan Secara Lokal

### Prasyarat
*   Node.js (versi 18 ke atas disarankan)
*   NPM / Yarn

### Langkah 1: Setup Environment (.env)
Salin berkas `.env.example` menjadi `.env` di direktori utama:
```bash
cp .env.example .env
```
Secara default, `USE_LOCAL_DB=true` aktif. Ini akan menggunakan simulasi basis data lokal berbasis berkas JSON (`backend/data/db.json`) sehingga Anda tidak membutuhkan Supabase eksternal untuk langsung mencobanya secara lokal!

### Langkah 2: Jalankan Backend (API Port 5000)
```bash
cd backend
npm install
npm run dev
```
Server backend akan menyala di: **`http://localhost:5000`**

### Langkah 3: Jalankan Frontend (Vite Port 5173)
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
Aplikasi frontend akan berjalan di: **`http://localhost:5173`**

---

## 🛠️ Keputusan Teknologi & Desain Sistem

*   **Penyimpanan Hibrida:** Mendukung mode lokal tanpa server database untuk kemudahan demonstrasi portofolio, namun siap dialihkan ke Supabase Postgres real hanya dengan mengubah bendera environment.
*   **Autentikasi Aman:** Sesi aman didukung oleh otentikasi JWT terproteksi. Rute profil dan skor dibatasi ketat menggunakan JWT Guard Middleware.
*   **Desain Kontemporer:** Dibangun menggunakan warna HSL kustom yang berani, dipadukan dengan tipografi deterministik modern dan transisi animasi fluid menggunakan Framer Motion.
