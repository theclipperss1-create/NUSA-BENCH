# Contributing Guidelines - NUSA-BENCH

Pedoman ini membantu pengembang mempertahankan kualitas kode, performa, dan standar keamanan yang tinggi di proyek NUSA-BENCH.

## 1. Aturan Penulisan Kode (Clean Code)
*   **CSS Kustom Premium:** Gunakan Vanilla CSS di `src/index.css` atau modul CSS khusus. Manfaatkan variabel CSS `--color-*` yang telah ditentukan di sistem token desain untuk warna HSL. Jangan mendefinisikan warna heksadesimal acak di tengah kode.
*   **Komponen Modular:** Pecah fungsi besar menjadi sub-komponen kecil. Tulis deskripsi prop dan gunakan tipe data yang aman.
*   **Keamanan Input:** Selalu validasi data formulir. Jangan gunakan `dangerouslySetInnerHTML` kecuali teks telah disanitasi secara ketat menggunakan library eksternal.

## 2. Pedoman Performa & Ringan
*   **Tree Shaking:** Impor ikon dari `lucide-react` secara terpisah:
    ```javascript
    import { Code, Server, Shield } from 'lucide-react';
    ```
*   **Re-rendering Minim:** Pastikan React Context hanya menangani state global yang benar-benar dibutuhkan oleh beberapa komponen (seperti data sesi atau proyek aktif). Gunakan state lokal (`useState`) untuk interaksi internal komponen (seperti input formulir atau status buka/tutup menu).

## 3. Komitmen Git (Git Conventions)
Gunakan konvensi commit pesan berbasis tipe deskriptif:
*   `feat: ...` untuk penambahan fitur baru.
*   `fix: ...` untuk perbaikan bug.
*   `docs: ...` untuk perubahan dokumentasi.
*   `style: ...` untuk penataan gaya CSS/formatting.
*   `refactor: ...` untuk restrukturisasi kode tanpa mengubah fungsionalitas.

## 4. Konfigurasi Linting
*   Jalankan `npm run lint` untuk memeriksa kesalahan kode sebelum melakukan build produksi.
*   Pastikan tidak ada peringatan (*warnings*) sisa pada ES6 dan React hooks dependencies.
