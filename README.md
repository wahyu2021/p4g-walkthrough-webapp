# Persona 4 Golden Walkthrough Scraper & Web App

Proyek ini bertujuan untuk mengonversi *100% Completion Guide* Persona 4 Golden dari GameFAQs (FAQ #76145 oleh Hurricanehaon) menjadi format data terstruktur (JSON), yang selanjutnya akan digunakan sebagai basis data untuk membangun aplikasi web *walkthrough* interaktif yang estetis.

## 📌 Latar Belakang & Fitur Utama

Panduan asli di GameFAQs berbentuk teks panjang yang dilindungi oleh proteksi *anti-bot* ketat (Cloudflare). Oleh karena itu, *scraper* ini tidak dibuat dengan metode ekstraksi HTTP biasa, melainkan menggunakan sistem peramban otomatis.

Fitur utama scraper ini meliputi:
- **Cloudflare Bypass (Stealth Mode)**: Menggunakan `Playwright` untuk merender halaman secara penuh layaknya peramban nyata, memungkinkan *script* untuk melewati tantangan Cloudflare (termasuk mode visual untuk penyelesaian CAPTCHA manual jika diperlukan).
- **Single-Page Architecture Parsing**: Mengambil keseluruhan panduan menggunakan *URL query* `?single=1` dan mengekstrak blok-blok konten berdasarkan *heading anchor id* (`#april`, `#may`, `#yukikos-castle`, dsb.).
- **Smart Text Extractor**: Mampu mengidentifikasi tanggal dan jenis instruksi, meskipun format asli hanya berupa *plain text* (`----------------~April 11th~----------------`) yang dibungkus di dalam tag `<p>`.
- **JSON Structuring**: Menghasilkan file JSON yang bersih dan siap konsumsi (`walkthrough.json`, `dungeons.json`, `social_links.json`).

## 📂 Struktur Direktori

```text
P4G Walkthrough/
├── data/                  # Folder output data terstruktur
│   ├── raw/               # (Cache) File HTML mentah hasil scraping
│   ├── walkthrough.json   # Data timeline hari demi hari (280 hari, 1800+ entries)
│   ├── dungeons.json      # Data panduan dungeon & boss
│   └── social_links.json  # Data interaksi Social Link
├── scraper/               # Direktori source code Python Scraper
│   ├── browser.py         # Modul Playwright & Cloudflare bypass
│   ├── config.py          # Konfigurasi URL, metadata, & anchors
│   ├── fetcher.py         # Logika pengunduhan (download) konten
│   ├── main.py            # CLI Entry Point
│   ├── parser.py          # Ekstraktor BeautifulSoup (Logika text-to-data)
│   ├── structurer.py      # Pembentuk format JSON akhir
│   └── test_parser.py     # Script pengujian logika parser secara offline
└── webapp/                # (Tahap Selanjutnya) Source code Frontend React Web App
```

## 🛠️ Cara Menjalankan Scraper

1. **Persiapan *Environment***
   Pastikan Anda sudah menginstal Python (disarankan 3.10+). Masuk ke folder `scraper/` dan buat *virtual environment*:
   ```bash
   cd scraper
   python -m venv venv
   ```

2. **Aktivasi Venv**
   - Windows (PowerShell): `.\venv\Scripts\Activate.ps1`
   - Linux/Mac: `source venv/bin/activate`

3. **Instalasi Dependensi**
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

4. **Menjalankan CLI**
   Scraper memiliki opsi CLI yang kaya. Anda dapat menjalankannya dalam mode *visible* (jika butuh intervensi CAPTCHA) menggunakan flag `--no-headless`:
   ```bash
   # Meng-scrape khusus bagian walkthrough bulanan
   python main.py --no-headless --sections walkthrough

   # Meng-scrape semua panduan secara berurutan
   python main.py --no-headless --sections all
   ```

## 🚀 Roadmap Proyek

- [x] **Fase 1: Data Extraction** (Menyelesaikan *scraper*, membersihkan logika parsing, validasi JSON).
- [ ] **Fase 2: Frontend Foundation** (Membuat aplikasi web dengan Vite + React.js, menyiapkan sistem *routing* dan desain Vanilla CSS bernuansa khas P4G).
- [ ] **Fase 3: Fitur Interaktif** (Mengimplementasikan UI *timeline* harian interaktif, fitur centang / *checklist* progres menggunakan *local storage*).
- [ ] **Fase 4: Polish & Deployment** (Micro-animations, responsivitas seluler, dan publikasi Vercel/Netlify).

---
*Disclaimer: Proyek ini dibuat semata-mata untuk pembelajaran scraping dan pengembangan UI/UX. Semua teks panduan P4G adalah hak cipta dari penulis asli (Hurricanehaon).*
