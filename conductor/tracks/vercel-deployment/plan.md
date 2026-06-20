# Rencana Implementasi: Vercel Deployment

## Fase 1: Penyesuaian Backend (Express Serverless) - [x] SELESAI
1. **Modifikasi `backend/src/index.ts`**
   - Hapus atau bungkus blok `app.listen(port, ...)` dengan kondisi agar tidak dijalankan pada environment Vercel.
   - Tambahkan `export default app;` di akhir file agar Vercel dapat meng-import instance Express sebagai handler function.
2. **Konfigurasi CORS**
   - Pastikan middleware `cors()` dikonfigurasi untuk mengizinkan (allow) origin dari Vercel atau biarkan terbuka (wildcard) sementara untuk memastikan koneksi berhasil.

## Fase 2: Konfigurasi Root & Vercel - [x] SELESAI
1. **Buat file `vercel.json`**
   - Buat konfigurasi routing.
   - *Keputusan yang diusulkan:* Membuat 2 project terpisah di Vercel:
     - **Project API**: Root Directory = `backend`, Konfigurasi `vercel.json` mengarahkan ke `src/index.ts` sebagai serverless function.
     - **Project Web**: Root Directory = `webapp`, Framework Preset = Vite.

## Fase 3: Persiapan Environment Variables
1. **MongoDB Atlas**
   - Pastikan Network Access di MongoDB Atlas diset ke `0.0.0.0/0` (Allow access from anywhere) karena IP Vercel Serverless Function dinamis.
2. **Vercel Dashboard**
   - Setup variabel `MONGO_URI` di Vercel Project (Backend).
   - Setup variabel `VITE_API_URL` di Vercel Project (Frontend) yang mengarah ke URL production API.

## Fase 4: Testing & Verifikasi
1. Commit semua penyesuaian kode.
2. Lakukan deployment awal (via git push ke repository yang terhubung dengan Vercel, atau via Vercel CLI `vercel deploy`).
3. Cek Health Route (`/api/health`) di production.
4. Lakukan interaksi di Frontend (centang day progress, navigasi dungeon) dan pastikan network tab menunjukkan API calls yang berstatus 200 OK.
