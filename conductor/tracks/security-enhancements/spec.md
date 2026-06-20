# Security Enhancements Specifications

## 1. Rate Limiting (`express-rate-limit`)
Karena aplikasi ini mengizinkan modifikasi basis data dengan kunci statis (`x-access-code`), endpoint penyimpanan menjadi target utama untuk *brute force password attack*. 
**Spec**:
- Target: `app.post('/api/progress/:userId')`
- Aturan: Maksimal 10 percobaan modifikasi per 5 menit dari IP yang sama.
- Pesan Penolakan: `Terlalu banyak request. Coba lagi dalam 5 menit.`

## 2. Helmet Security Headers (`helmet`)
Helmet secara otomatis menonaktifkan/mengkonfigurasi 11+ HTTP headers yang membahayakan aplikasi.
**Spec**:
- Content-Security-Policy (CSP): Konfigurasi standar untuk API.
- X-Powered-By: Dimatikan (menyamarkan Express.js).
- HSTS: Dinyalakan dengan `maxAge: 31536000` (wajib HTTPS).

## 3. NoSQL Injection Protection (`express-mongo-sanitize`)
Permintaan POST yang di-parsing sebagai JSON bisa berisi *query selector* MongoDB (seperti `{ "$ne": null }`). Jika lolos, hal ini dapat mengecoh pembaruan dokumen.
**Spec**:
- `app.use(mongoSanitize())`: Semua `req.body`, `req.query`, dan `req.params` tidak boleh mengandung key bermata uang (dolar) `$` atau titik `.`.

## 4. Nginx Tuning
Untuk memastikan Nginx tidak dimanfaatkan sebagai celah kelemahan dari jaringan lapisan luar:
**Spec**:
- Tambahkan `server_tokens off;` di `/etc/nginx/nginx.conf` atau *server block* agar header `Server: nginx/1.24.0` menghilang.
- Tambahkan `client_max_body_size 1M;` (Aplikasi ini hanya mengirim JSON kecil, tidak lebih dari 1 MB).
