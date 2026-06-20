# Specification: MongoDB Integration

## Goal
Mengubah sistem penyimpanan data statis (JSON lokal) dan progres (Local Storage) menjadi sistem yang dinamis dan persisten menggunakan database MongoDB.

## Requirements
1. **Backend Service:** Karena saat ini project menggunakan React (Vite) yang bersifat klien (frontend-only) dan script scraper (Python), diperlukan sebuah Backend API (misalnya Node.js Express, Python FastAPI, atau memigrasikan project ke Next.js) untuk menghubungkan frontend dengan MongoDB.
2. **Database Schema:** Merancang skema (collections) untuk data walkthrough, activities, dungeons, exams, social_links, dan progress tracker pengguna.
3. **Data Migration:** Membuat skrip untuk memigrasikan semua data `.json` di folder `data/` ke MongoDB.
4. **API Integration:** Mengubah logika *fetching* di Webapp (React) untuk mengambil data dari backend API alih-alih file statis.
5. **Progress Sync:** Mengubah sistem `useProgress` (yang saat ini menggunakan localStorage) agar menyimpan dan memuat progres dari/ke MongoDB.
6. **Authentication (Simple Username Login):** Agar progres pengguna tidak tertukar, aplikasi memerlukan form login sederhana di mana pengguna cukup memasukkan *Username* (contoh: "Yuu"). Username ini akan menjadi `userId` untuk mengambil dan menyimpan progres secara independen di MongoDB.

## Pre-requisites (Persiapan dari User)
- **MongoDB Cluster:** Sudah dibuat (User confirmation).
- **Connection String (URI):** URL koneksi ke MongoDB (jangan di-commit ke repositori, simpan di file `.env`).
- **Pilihan Stack Backend:** Menentukan teknologi backend yang ingin digunakan (Express.js, FastAPI, atau Next.js/Remix).
