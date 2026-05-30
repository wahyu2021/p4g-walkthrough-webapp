# P4G Walkthrough Project Status - 28 Mei 2026 (Updated)

## Deskripsi Singkat
Aplikasi panduan 100% completion Persona 4 Golden berbasis Web React dengan data hasil scraping otomatis. Proyek saat ini telah memiliki fondasi navigasi dan tracking yang solid.

## Arsitektur & Tech Stack
- **Backend/Scraper**: Python, Playwright (Cloudflare bypass), BeautifulSoup.
- **Frontend**: React 19, Tailwind CSS v4, Vite, TypeScript.
- **Methodology**: Atomic Design (Atoms, Molecules, Organisms, Templates, Pages).
- **State Management**: React Context API (Global Progress) & LocalStorage untuk sinkronisasi state yang stabil.

## Fitur yang Sudah Selesai & Stabil
1. **Unified Sidebar & Scalable Nav**: Seluruh navigasi utama dipindahkan ke Sidebar yang sticky (desktop) dan horizontal scrollable (mobile).
2. **Global Progress Tracking**: Sinkronisasi centang hari antar komponen menggunakan Context API. Akurasi progres menggunakan format 0.00%.
3. **Walkthrough Timeline**: Kartu harian dengan sticky date header dan kategori aktivitas berwarna.
4. **Exams Q&As**: Sistem Smart Extractor yang memilah multi-pertanyaan dari timeline menjadi kartu-kartu terpisah yang searchable.
5. **Search System**: Pencarian real-time pada halaman Walkthrough dan Exams dengan visual border P4G yang responsif (Focus mode).
6. **Social Links & Dungeons**: Halaman direktori yang menampilkan informasi dasar dan tenggat waktu (deadline).

## Perbaikan Bug & UI Discovery
- **Skew vs Clip-path**: Menggunakan `clip-path` pada DayCards untuk menghindari konten terpotong pada kartu yang sangat panjang.
- **State Sync**: Perbaikan tombol Reset yang kini merubah status visual seluruh kartu harian secara instan via Context.
- **Z-Index Isolate**: Perbaikan border SearchInput yang "tenggelam" dengan menggunakan CSS isolation.

## Draft Baru (Untuk Sesi Selanjutnya)
1. **Social Stats & Collection Tracker**: Membuat halaman baru (`/tracker`) yang memungkinkan pengguna melacak 5 Atribut Sosial utama (Knowledge, Courage, Diligence, Understanding, Expression) secara interaktif, yang tersimpan di LocalStorage. [Tracker Plan](./tracks/social-stats-tracker/plan.md)

## Langkah Selanjutnya (Backlog)
- Integrasi data Quest dan Books hasil scraping ke dalam halaman Tracker.
- Dukungan Offline PWA.
- Deployment ke Vercel/Netlify.
