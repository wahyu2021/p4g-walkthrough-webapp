# Spesifikasi Vercel Deployment

## 1. Tujuan
Menyediakan akses publik untuk aplikasi P4G Walkthrough melalui internet dengan performa tinggi dan skalabilitas otomatis menggunakan Vercel.

## 2. Arsitektur Deployment
- **Frontend (Webapp):** Dideploy sebagai aplikasi React (Vite) statis pada Vercel.
- **Backend (API):** Dideploy sebagai Vercel Serverless Function menggunakan runtime Node.js.
- **Database:** Menggunakan MongoDB Atlas (harus di-whitelist atau dikonfigurasi untuk menerima koneksi dari Vercel IP/allow all).

## 3. Penyesuaian yang Dibutuhkan
1. **Serverless Backend:** Vercel Serverless Functions tidak memerlukan `app.listen()`. Instance Express harus diexport (`export default app`).
2. **Konfigurasi Routing (vercel.json):** Membuat `vercel.json` di root atau di dalam folder backend untuk mengarahkan request API ke Serverless Function, sedangkan request lainnya dilayani oleh frontend.
3. **Environment Variables:** Vercel Dashboard perlu dikonfigurasi dengan `MONGO_URI` dan `VITE_API_URL`.
4. **CORS:** Backend harus dikonfigurasi untuk mengizinkan request dari domain frontend di Vercel.

## 4. Kriteria Penerimaan (Acceptance Criteria)
- [ ] Aplikasi Frontend dapat diakses melalui URL Vercel.
- [ ] Frontend dapat melakukan request ke endpoint `/api/*` tanpa error CORS.
- [ ] Data dari MongoDB (walkthrough, social links, dungeons, progress) dapat di-fetch dan disimpan dengan baik.
- [ ] Build Frontend (`npm run build`) berjalan sukses di infrastruktur Vercel.
