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
1. **Dungeon Scraper Upgrade**: Rencana untuk mengekstrak tabel FAQ (Bestiary, Boss Stats) dan daftar Loot/Persona menggunakan Python. [Dungeon Scraper Plan](./tracks/dungeon-scraper-upgrade/plan.md)
2. **The Midnight Hub (Interactive Dungeon)**: Fitur bestiary yang bisa difilter berdasarkan kelemahan elemen dan strategi boss detail. [Interactive Guide Plan](./tracks/interactive-dungeon-guide/plan.md)

## Langkah Selanjutnya (Backlog)
- Eksekusi Scraper Dungeon Upgrade.
- Implementasi widget "Today's Schedule" (Prioritas Hari Pertama yang Belum Selesai).
- Social Stats & Collection Tracker.
- Deployment ke Vercel/Netlify.
