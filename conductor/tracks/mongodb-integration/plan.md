# Implementation Plan: MongoDB Integration

## Phase 1: Backend Setup & Configuration
1. **Pilih Teknologi Backend:** Tentukan apakah akan menggunakan Node.js (Express), Python (FastAPI), atau Next.js.
2. **Inisialisasi Project Backend:** Buat direktori `backend/` (jika menggunakan terpisah) dan inisialisasi project.
3. **Konfigurasi Environment:** Buat file `.env` untuk menyimpan `MONGODB_URI` dan kredensial lainnya. (Pastikan `.env` ada di `.gitignore`).
4. **Koneksi Database:** Tulis modul koneksi database menggunakan **native MongoDB Driver** (misalnya package `mongodb` untuk Node.js atau `pymongo` untuk Python) tanpa menggunakan ODM.

## Phase 2: Skema & Migrasi Data
1. **Buat Model/Schema:** Buat model untuk `Walkthrough`, `Dungeon`, `SocialLink`, `Exam`, dan `UserProgress`.
2. **Skrip Migrasi (Seeding):** Buat skrip (misal `seed.js` atau `seed.py`) yang membaca file di folder `data/*.json` dan memasukkannya (insert) ke MongoDB collections.
3. **Jalankan Migrasi:** Eksekusi skrip migrasi untuk mengisi database.

## Phase 3: Pembuatan API Endpoints
1. **Data Endpoints (GET):** Buat API endpoints untuk mengambil data walkthrough, dungeons, exams, dll. (misal: `GET /api/walkthrough`).
2. **Progress Endpoints (GET/POST/PUT):** Buat API untuk membaca dan mengupdate status penyelesaian (progress) pengguna (misal: `POST /api/progress/:userId`).

## Phase 4: Integrasi Frontend
1. **Update `dataFetcher.ts`:** Ganti logika pembacaan file JSON menjadi HTTP request (misal dengan `fetch` atau `axios`) ke Backend API.
2. **Update `useProgress.ts`:** Ubah implementasi localStorage agar melakukan sinkronisasi dengan database melalui API (pertimbangkan caching lokal untuk performa).

## Phase 5: Simple Login & Progress Sync (Testing & Validation)
1. **Buat Login UI (Sederhana):** 
   - Modifikasi `App.tsx` atau buat *component* baru untuk mengecek ketersediaan `userId` di `localStorage`.
   - Jika belum ada, tampilkan *screen* atau *modal* yang meminta pengguna memasukkan nama (misal: "Yuu").
2. **Update `useProgress.ts` (Progress Sync):**
   - Ambil `userId` yang sedang aktif.
   - Panggil `GET /api/progress/:userId` saat aplikasi pertama kali dimuat (atau saat user baru login) untuk menimpa state `completedDays`, `socialStats`, dll dengan data dari database.
   - Panggil `POST /api/progress/:userId` dengan seluruh state *progress* saat ini setiap kali pengguna mencentang sesuatu (gunakan *debouncing* jika perlu agar tidak spam API).
3. **Validasi:** 
   - Uji koneksi database di *environment* lokal.
   - Pastikan login dengan username "Yuu" me-load data "Yuu".
   - Logout (hapus localStorage) dan login dengan nama lain untuk memastikan data kosong/terpisah.
