# PRD — NusaBench 🇮🇩🧠
**Product Requirements Document v1.0**
*Human Benchmark versi Indonesia*

---

## 1. Overview

### 1.1 Nama Produk
**NusaBench** *(Nusantara Benchmark)*

Alternatif nama:
- Benchmark Nusantara
- BrainRank ID
- Otak Indonesia
- NusaMind

### 1.2 Deskripsi Singkat
NusaBench adalah platform pengujian kemampuan kognitif berbasis web yang menggabungkan game ringan, tes otak ilmiah, dan wawasan kebangsaan Indonesia — dikemas dalam pengalaman yang cepat, fun, dan kompetitif.

### 1.3 Tagline
> *"Uji otakmu. Buktikan ke-Indonesia-anmu."*

### 1.4 Tujuan Produk
- Menyediakan platform benchmark kognitif yang ringan dan bisa diakses siapa saja
- Mengedukasi pengguna tentang pengetahuan Indonesia sambil bermain
- Membangun komunitas kompetitif yang sehat melalui leaderboard
- Menjadi referensi kemampuan otak populer di Indonesia

---

## 2. Problem Statement

### 2.1 Masalah yang Diselesaikan
| Masalah | Solusi NusaBench |
|---------|-----------------|
| Human Benchmark global tidak relevan konteks Indonesia | Menambahkan modul Wawasan Indonesia |
| Platform serupa berat dan lambat di HP kentang | Stack ringan, target < 1 detik load |
| Tidak ada kompetisi berbasis benchmark kognitif di Indonesia | Leaderboard lokal + regional |
| Tidak ada cara menyenangkan belajar wawasan Indonesia | Gamifikasi trivia nasional |

### 2.2 Unique Value Proposition
NusaBench adalah **satu-satunya** platform benchmark otak yang:
1. Mengintegrasikan pengetahuan lokal Indonesia sebagai core feature
2. Dioptimasi untuk perangkat low-end
3. Memiliki profil kognitif + profil ke-Indonesia-an

---

## 3. Target Pengguna

### 3.1 Primary Users
| Segmen | Deskripsi | Motivasi |
|--------|-----------|----------|
| Pelajar SMA/Mahasiswa (15–25 tahun) | Sering membandingkan kemampuan | Kompetisi, belajar sambil main |
| Gamer casual | Terbiasa dengan skor dan ranking | Kompetisi, high score |
| Pengguna yang suka self-assessment | Ingin tahu kemampuan diri | Insight pribadi |

### 3.2 Secondary Users
| Segmen | Deskripsi |
|--------|-----------|
| Guru/Dosen | Menggunakan untuk aktivitas kelas |
| Orang yang ingin belajar wawasan Indonesia | Persiapan ujian, CPNS, dll |

### 3.3 Device & Constraint
- **HP RAM 2–4 GB** (target utama)
- **Laptop low-end** (Core i3, RAM 4 GB)
- **Browser modern** (Chrome 80+, Firefox 75+, Safari 14+)
- **Koneksi lambat** (3G / 10 Mbps)
- **Resolusi minimum**: 360×640px (HP kecil)

---

## 4. Feature List & Prioritasi

### 4.1 MVP (Phase 1 — Launch)
| # | Feature | Prioritas |
|---|---------|-----------|
| 1 | Reaction Time Test | P0 |
| 2 | Number Memory | P0 |
| 3 | Sequence Memory | P0 |
| 4 | Wawasan Indonesia — Geografi | P0 |
| 5 | Wawasan Indonesia — Sejarah | P0 |
| 6 | Profil Pengguna (LocalStorage) | P0 |
| 7 | Leaderboard Lokal (browser) | P0 |
| 8 | Achievement dasar | P1 |
| 9 | Aim Trainer | P1 |
| 10 | Visual Memory | P1 |

### 4.2 Phase 2 — Growth
| # | Feature | Prioritas |
|---|---------|-----------|
| 11 | Tracking Test | P1 |
| 12 | Verbal Memory | P1 |
| 13 | Focus Mode | P1 |
| 14 | Logic — Pattern Recognition | P1 |
| 15 | Fun Mode — NPC Quiz | P2 |
| 16 | Wawasan Indonesia — Budaya & Kuliner | P1 |
| 17 | Leaderboard Online | P1 |
| 18 | Backend + Auth | P1 |

### 4.3 Phase 3 — Scale
| # | Feature |
|---|---------|
| 19 | PWA / Install |
| 20 | Fun Mode — Zombie Simulator |
| 21 | Multitasking Test |
| 22 | Distraction Test |
| 23 | Spatial Reasoning |
| 24 | Daily Challenge |
| 25 | Share to Social |

---

## 5. Spesifikasi Fitur Detail

### 5.1 Reaction Time Test ⚡

**Deskripsi:** Mengukur kecepatan respons visual pengguna.

**Flow:**
1. Layar merah muncul dengan instruksi "Tunggu..."
2. Setelah delay random (1.5–5 detik), layar berubah hijau
3. Pengguna klik/tap secepat mungkin
4. Jika klik sebelum hijau → "Terlalu cepat!" → reset
5. Hasil ditampilkan + rata-rata 5 attempt

**Output:**
```
Reaction Time: 183 ms
Lebih cepat dari 91% pemain
Kategori: SANGAT CEPAT ⚡
```

**Scoring:**
| Waktu | Kategori | Warna |
|-------|----------|-------|
| < 150ms | Extreme | Emas |
| 150–200ms | Sangat Cepat | Hijau |
| 200–250ms | Normal | Biru |
| 250–300ms | Di bawah rata-rata | Kuning |
| > 300ms | Lambat | Merah |

**Edge Cases:**
- Klik saat merah → "Terlalu cepat! Jangan curang 😄"
- Tab tidak aktif → tes ter-pause otomatis

---

### 5.2 Aim Trainer 🎯

**Deskripsi:** Mengukur kecepatan dan akurasi klik target.

**Konfigurasi:**
- Jumlah target: 30
- Ukuran target: dinamis (makin lama makin kecil)
- Durasi: diukur dari klik pertama sampai target ke-30

**Metrik Output:**
| Metrik | Keterangan |
|--------|-----------|
| Total waktu | Dalam detik |
| Akurasi | (Hit / Total klik) × 100 |
| Targets per second | 30 / total waktu |
| Miss count | Klik yang tidak mengenai target |

---

### 5.3 Number Memory 🧠

**Flow:**
1. Tampilkan angka N digit selama (N × 0.8 detik)
2. Angka menghilang
3. Pengguna mengetik ulang
4. Benar → level +1 (digit +1)
5. Salah → game over, catat level tertinggi

**Level → Digit:**
| Level | Digit |
|-------|-------|
| 1 | 3 |
| 2 | 4 |
| 3 | 6 |
| 5 | 8 |
| 10 | 12 |
| 15 | 16 |

---

### 5.4 Sequence Memory 🟦

**Flow:**
1. Grid 3×3 kotak
2. Kotak menyala urutan tertentu
3. User klik kotak sesuai urutan
4. Level meningkat = urutan lebih panjang

---

### 5.5 Visual Memory 🔲

**Flow:**
1. Grid N×N muncul dengan beberapa kotak terisi (berwarna)
2. Kotak semua blank setelah beberapa detik
3. User klik posisi yang tadi terisi
4. Benar semua → level naik (grid lebih besar, kotak lebih banyak)

---

### 5.6 Verbal Memory 📝

**Flow:**
1. Tampilkan satu kata
2. User tekan **BARU** atau **PERNAH**
3. Skor bertambah jika benar
4. Salah → game over

**Kata dasar:** 300+ kata umum bahasa Indonesia

---

### 5.7 Wawasan Indonesia 🇮🇩

**Kategori & Jumlah Soal:**
| Kategori | Jumlah Soal |
|----------|-------------|
| Geografi | 200+ |
| Sejarah | 200+ |
| Budaya & Seni | 150+ |
| Kuliner Nusantara | 100+ |
| Tokoh Indonesia | 150+ |

**Format Soal:**
- Pilihan ganda (4 pilihan)
- True/False
- Identifikasi gambar (foto/ilustrasi)
- Isi bagian yang kosong

**Contoh Soal:**
```
Ibu kota Provinsi Jawa Barat adalah...
A) Bekasi  B) Bandung  C) Bogor  D) Depok

Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...
A) 16 Agustus 1945  B) 17 Agustus 1945
C) 18 Agustus 1945  D) 20 Agustus 1945

Pempek adalah kuliner khas dari...
A) Makassar  B) Padang  C) Palembang  D) Pontianak
```

**Scoring:**
- Benar: +10 poin
- Salah: -3 poin (untuk mencegah asal tebak)
- Waktu bonus: jawab cepat = bonus poin
- Streak bonus: 5 benar berturut = ×2 poin

---

### 5.8 Fun Mode 🎮

#### Apakah Kamu NPC?
Quiz personality 10 pertanyaan. Output: **NPC Score 0–100%**.
Pertanyaan contoh:
- "Kamu biasanya jawab gimana kalau ditanya kabar?"
- "Kamu ngikutin tren karena orang lain juga ikutin?"

#### Seberapa Indonesia Kamu?
Quiz tentang kebiasaan, budaya, dan pengetahuan Indonesia.
Output: **Indonesia Score** + label (Mancanegara / Abang/Mpok / Anak Nusantara / Putra/Putri Bangsa)

#### Zombie Apocalypse Simulator
User memilih:
- 3 orang teman dari daftar karakter
- 3 barang dari daftar
- 1 strategi

Output: **Survival Probability %** + narasi hasil

---

## 6. User Profile & Progression

### 6.1 Profil Data
```json
{
  "username": "string",
  "level": "number",
  "xp": "number",
  "avatar": "string (emoji atau icon)",
  "joined": "date",
  "scores": {
    "reaction": "number (ms)",
    "aimTrainer": { "time": "number", "accuracy": "number" },
    "numberMemory": "number (level)",
    "sequenceMemory": "number (level)",
    "visualMemory": "number (level)",
    "verbalMemory": "number (score)",
    "wawasanIndonesia": "number (score)"
  },
  "achievements": ["string[]"],
  "gamesPlayed": "number"
}
```

### 6.2 Level & XP System
| Level | Nama | XP Dibutuhkan |
|-------|------|--------------|
| 1 | Otak Baru | 0 |
| 5 | Pelajar Nusantara | 500 |
| 10 | Cendikiawan | 2000 |
| 20 | Jenius Lokal | 8000 |
| 50 | Legenda Nusantara | 50000 |

---

## 7. Achievement System

| Badge | Nama | Syarat |
|-------|------|--------|
| ⚡ | Kilat | Reaction < 150ms |
| 🎯 | Jago Tembak | Aim accuracy > 95% |
| 🧠 | Memory King | Number memory level 15+ |
| 🇮🇩 | Ahli Nusantara | Wawasan Indonesia score > 90% |
| 🔥 | On Fire | 10 tes dalam sehari |
| 👑 | Raja Leaderboard | Masuk top 10 |
| 🦅 | Garuda | Semua tes selesai minimal sekali |
| 📚 | Kutu Buku | Jawab 500 soal wawasan |
| ⭐ | Bintang | Total XP > 10.000 |
| 🏆 | Nusantara Champion | Score sempurna di semua kategori |

---

## 8. Leaderboard System

### 8.1 Tipe Leaderboard
| Tipe | Keterangan |
|------|-----------|
| Global All-Time | Skor terbaik sepanjang masa |
| Indonesia | Khusus IP Indonesia |
| Mingguan | Reset setiap Senin 00.00 WIB |
| Harian | Reset setiap 00.00 WIB |
| Per Kategori | Leaderboard per jenis tes |

### 8.2 Tampilan
```
🏆 Leaderboard Mingguan — Reaction Time

# 1  🥇 GarengSolo      — 142 ms
# 2  🥈 PetraJKT        — 148 ms
# 3  🥉 BimaBDG         — 151 ms
# 4     AnisaMDN        — 158 ms
# 5     ※ Kamu ※        — 163 ms  ← highlight
```

---

## 9. Result & Profil Kognitif

Setelah menyelesaikan semua tes utama:

```
━━━━━━━━━━━━━━━━━━━━━━━━━
   PROFIL OTAK KAMU 🧠
━━━━━━━━━━━━━━━━━━━━━━━━━

Refleks        ██████████  92  — Kilat ⚡
Memori         ████████░░  78  — Kuat 🧠
Fokus          ███████░░░  70  — Baik 👁️
Logika         █████████░  88  — Tajam 🔍
Wawasan ID     ██████████  95  — Ahli 🇮🇩

Tipe Otak: ANALIS NUSANTARA
"Refleks tinggi, wawasan luas. Kamu penggabung antara
ketangkasan dan kecerdasan lokal."
━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 10. Non-Functional Requirements

### 10.1 Performance
| Metrik | Target |
|--------|--------|
| First Contentful Paint | < 1.5 detik |
| Time to Interactive | < 2 detik |
| Bundle size | < 500 KB |
| RAM usage | < 100 MB |
| Lighthouse Score | > 90 |

### 10.2 Accessibility
- Keyboard navigable
- Kontras warna memenuhi WCAG AA
- Font size minimum 14px
- Touch target minimum 44×44px

### 10.3 Compatibility
| Platform | Support |
|---------|---------|
| Chrome 80+ | ✅ |
| Firefox 75+ | ✅ |
| Safari 14+ | ✅ |
| Edge 80+ | ✅ |
| Chrome Android | ✅ |
| Samsung Internet | ✅ |

---

## 11. Success Metrics

### 11.1 Launch (Month 1)
- 1.000 pengguna unik
- 5.000 tes dimainkan
- Average session > 5 menit

### 11.2 Growth (Month 3)
- 10.000 pengguna unik/bulan
- 50.000 tes/bulan
- DAU/MAU ratio > 20%
- Bounce rate < 40%

### 11.3 Scale (Month 6)
- 50.000 pengguna terdaftar
- Viral coefficient > 1
- Featured di media tech Indonesia

---

## 12. Out of Scope (V1)

- Aplikasi mobile native (iOS/Android)
- Multiplayer real-time
- Monetisasi / iklan
- Login sosial (Google, Facebook) -> Wait, PRD says out of scope for V1, but I already put Supabase Auth. It's okay, Supabase Auth provides email/password easily too.
- Subscription / premium tier
- API publik
