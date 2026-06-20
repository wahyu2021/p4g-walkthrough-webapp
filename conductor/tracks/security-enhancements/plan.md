# Security Enhancements Plan

## Phase 1: Backend Package Installation
- [ ] Install dependensi `helmet` untuk mengamankan HTTP headers.
- [ ] Install dependensi `express-rate-limit` untuk membatasi jumlah permintaan.
- [ ] Install dependensi `express-mongo-sanitize` untuk mencegah NoSQL Injection.
- [ ] Install `@types/helmet`, dll (jika perlu untuk TypeScript).

## Phase 2: Express.js Hardening
- [ ] Implementasi `helmet()` di `backend/src/index.ts`.
- [ ] Buat instance `express-rate-limit` (misal: max 100 request per 15 menit).
- [ ] Implementasikan rate limiter tersebut khusus pada endpoint `/api/progress` untuk menghindari *password brute force*.
- [ ] Pasang `express-mongo-sanitize()` untuk memastikan payload dari body tidak memuat karakter dolar `$` atau titik `.` (mencegah *NoSQL injection*).

## Phase 3: Nginx Server Tuning (VPS)
- [ ] Sembunyikan versi Nginx dengan mengubah nilai `server_tokens off;`.
- [ ] Batasi ukuran `client_max_body_size` pada Nginx (misal: 1M) agar hacker tidak dapat mengirim payload raksasa yang menyebabkan memori server penuh.
- [ ] Pastikan Nginx hanya merespon untuk *Host* yang dikenali.

## Phase 4: Testing & Deployment
- [ ] Uji coba simulasi serangan *Brute Force* (lihat apakah rate limiter berfungsi memblokir IP lokal/tester).
- [ ] Uji coba payload berbahaya `{ "$gt": "" }` pada body.
- [ ] Commit, Push, dan validasi fungsionalitas di production melalui GitHub Actions.
