# UI/UX Specifications - NUSA-BENCH

Pedoman spesifikasi visual ini mengacu pada standar kustom **UI/UX Pro Max** untuk menciptakan antarmuka yang mewah (*premium*), halus (*smooth*), dan ringan (*lightweight*).

## 1. Sistem Warna (Skema Gelap Premium)
Kami menggunakan palet warna HSL kustom yang dirancang khusus untuk mengurangi ketegangan mata serta memberikan nuansa futuristik:

*   **Background Utama:** `hsl(220, 12%, 6%)` — Obsidian Gelap Hangat (Obsidian Charcoal Black).
*   **Background Card/Glass:** `hsla(220, 12%, 10%, 0.7)` — Semi transparan dengan efek `backdrop-filter: blur(16px)`.
*   **Warna Primer (Accent):** `hsl(358, 75%, 45%)` — Merah Nusantara (Heritage Crimson Red).
*   **Warna Sekunder:** `hsl(45, 80%, 50%)` — Emas Majapahit (Majapahit Gold).
*   **Warna Teks Utama:** `hsl(45, 15%, 96%)` — Putih Pasir Hangat (Warm Sand White).
*   **Warna Teks Sekunder:** `hsl(220, 10%, 65%)` — Abu-abu Muted (Slate Gray).
*   **Border/Muted Glow:** `hsla(358, 75%, 45%, 0.15)` — Efek bayangan merah tipis.

## 2. Tipografi
Menggunakan font Google Fonts untuk keterbacaan modern:
*   **Header & Judul (`<h1>`, `<h2>`, `<h3>`):** *Outfit* atau *Inter* dengan ketebalan 700 (Bold) / 800 (Extra Bold).
*   **Teks Utama (Body & UI):** *Inter* dengan ketebalan 400 (Regular) / 500 (Medium) / 600 (Semi-Bold).
*   **Font-pairing:** `font-family: 'Outfit', 'Inter', sans-serif;`

## 3. Tata Letak (Bento Grid & Spacing)
*   **Sistem Grid:** Layout Bento Grid dengan jarak (*gap*) antar-kartu sebesar `24px` (`1.5rem`).
*   **Spacing Scale:** Menggunakan faktor kelipatan 8px: `8px`, `16px`, `24px`, `32px`, `48px`, `64px`.
*   **Border Radius:**
    *   Kartu Bento Utama: `24px` (`1.5rem`).
    *   Tombol & Input UI: `12px` (`0.75rem`).
    *   Tag / Badge: `9999px` (Pill).

## 4. Mikro-Animasi & Interaksi
*   **Efek Hover Kartu Bento:**
    *   Sedikit bergeser ke atas (`transform: translateY(-4px)`) dengan bayangan bersinar (*soft shadow glow*).
    *   Transisi: `all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)`.
*   **Interaksi Tombol:**
    *   Klik (Active state): `transform: scale(0.96)`.
    *   Target Sentuh (Mobile): Minimal `48px` untuk mencegah salah klik.
*   **Fokus State:**
    *   Ring outline setebal `2px solid var(--color-secondary)` dengan offset `2px`.

## 5. Komponen Utama
1.  **Navbar Glassmorphic:** Berada tetap di bagian atas dengan perpaduan blur latar belakang dan border halus.
2.  **Service Cards (Bento Grid):** Kartu berukuran variatif (lebar 1x atau 2x) yang menampung deskripsi layanan, ikon berkilau, dan tombol interaksi mikro.
3.  **Dynamic Estimator Panel:** Slider interaktif untuk memilih perkiraan waktu dan anggaran, ditambah daftar opsi sakelar yang bereaksi instan secara visual.
4.  **Dashboard Hub:**
    *   Indikator status melingkar yang animatif.
    *   Visualisasi daftar tugas berupa lini masa progres vertikal.
