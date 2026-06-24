# Folder Structure - NUSA-BENCH

Berikut adalah struktur direktori NUSA-BENCH yang telah dirapikan ke dalam sub-folder **frontend** dan **backend** secara terpisah untuk mempermudah pengembangan full-stack.

```
NUSA-BENCH/
├── frontend/               # Folder Aplikasi Frontend (Vite + React)
│   ├── public/             # File aset statis
│   │   └── favicon.svg     # Ikon situs web
│   ├── src/                # Berkas kode sumber utama
│   │   ├── components/     # Komponen UI modular
│   │   │   ├── BentoServices.jsx # Bento Grid untuk Layanan
│   │   │   ├── Estimator.jsx     # Kalkulator Estimasi Proyek
│   │   │   ├── Dashboard.jsx     # Hub Dashboard Klien
│   │   │   ├── Navbar.jsx        # Bilah Navigasi Glassmorphic
│   │   │   ├── BookingForm.jsx   # Formulir Pemesanan Layanan
│   │   │   └── LoginPortal.jsx   # Portal Login Sesi Klien
│   │   ├── context/        # React Context untuk State Management
│   │   │   └── ProjectContext.jsx # Mengelola state proyek & invoice
│   │   ├── services/       # Integrasi Layanan API Frontend
│   │   │   └── api.js      # Pemanggilan fetch ke backend port 5000
│   │   ├── App.jsx         # Komponen Utama Root
│   │   ├── index.css       # Sistem Desain Token CSS & Global Style
│   │   └── main.jsx        # Entry point aplikasi React
│   ├── eslint.config.js    # Konfigurasi ESLint
│   ├── index.html          # Template HTML Utama
│   ├── package.json        # Dependensi & script frontend
│   └── vite.config.js      # Konfigurasi bundler Vite
│
├── backend/                # Folder Aplikasi Backend (Node.js + Express)
│   ├── data/               # Penyimpanan Data Database Lokal
│   │   └── db.json         # File database JSON
│   ├── server.js           # Server Express API Endpoints
│   └── package.json        # Dependensi & script backend
│
├── PRD.md                  # Spesifikasi Produk
├── TECH_STACK.md           # Dokumentasi Teknologi
├── UI_SPEC.md              # Spesifikasi UI/UX
├── DATABASE.md             # Skema Penyimpanan Data
├── API.md                  # Spesifikasi API Mock
├── STRUCTURE.md            # Struktur Proyek (dokumen ini)
├── ROADMAP.md              # Rencana Pengembangan
└── CONTRIBUTING.md         # Pedoman Kontribusi Kode
```

## Deskripsi Folder Utama

### 1. `frontend/`
*   `frontend/src/components/`: Menampung seluruh antarmuka komponen visual modular.
*   `frontend/src/context/`: Mengatur integrasi data global seperti status login, status pemesanan, dan trigger update invoice.
*   `frontend/src/services/api.js`: Melakukan request API sesungguhnya menggunakan `fetch` menuju server backend di port 5000. Jika server backend tidak menyala, service ini memunculkan error informatif.

### 2. `backend/`
*   `backend/server.js`: Server web Node.js yang melayani router API untuk login, proyek, dan penanganan invoice.
*   `backend/data/db.json`: Database file lokal bertipe JSON yang secara otomatis menginisialisasi skema awal dan menyimpan perubahan data dari client secara asinkron.
