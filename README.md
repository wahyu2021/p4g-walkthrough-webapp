# 🎮 Persona 4 Golden — Interactive Walkthrough

> **100% Completion Guide** untuk Persona 4 Golden, dikonversi dari panduan legendaris [Hurricanehaon (GameFAQs)](https://gamefaqs.gamespot.com/vita/641695-persona-4-golden/faqs/76145) menjadi aplikasi web interaktif yang modern dan estetis.

![Tech Stack](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.14-3776AB?style=flat&logo=python&logoColor=white)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|:------|:----------|
| 📅 **Walkthrough Timeline** | Panduan hari demi hari (280 hari, 1800+ instruksi) dengan navigasi per bulan |
| ✅ **Progress Tracker** | Centang hari yang sudah selesai — progres tersimpan otomatis di browser (`localStorage`) |
| 🔍 **Live Search** | Cari instruksi, aktivitas, atau event tertentu secara instan |
| ⚔️ **Dungeon Guide** | Daftar 11 dungeon lengkap dengan deadline dan info boss |
| 💬 **Social Links** | Direktori 23 Social Link dengan detail Arcana dan karakter |
| 📝 **Exam Answers** | Kumpulan jawaban ujian dan kuis sekolah |
| 🎨 **Persona 4 Aesthetic** | UI bertema khas P4G — kuning ikonik, efek skew, animasi mikro, dan desain bold |

---

## 📸 Tampilan Aplikasi

> _Screenshots akan ditambahkan setelah fase polish selesai._

---

## 🏗️ Arsitektur Proyek

Proyek ini terdiri dari **2 modul utama**: sebuah _scraper_ Python yang mengekstrak data dari GameFAQs, dan sebuah _web app_ React yang menampilkan data tersebut.

```text
P4G Walkthrough/
│
├── 📁 scraper/                    # Python – Data Extraction Tool
│   ├── main.py                    # CLI entry point
│   ├── browser.py                 # Playwright + Cloudflare bypass
│   ├── fetcher.py                 # Logika download konten
│   ├── parser.py                  # BeautifulSoup text-to-data
│   ├── structurer.py              # Pembentuk JSON akhir
│   ├── config.py                  # URL, metadata, dan anchors
│   └── requirements.txt           # Dependensi Python
│
├── 📁 webapp/                     # React – Interactive Web App
│   └── src/
│       ├── components/
│       │   ├── atoms/             # Button, SearchInput, ActivityEntry, ScrollToTop
│       │   ├── molecules/         # DayCard, MonthTab, NavTabs, DungeonCard, SocialLinkCard, ExamCard
│       │   ├── organisms/         # DayList, MonthSelector
│       │   └── templates/         # MainLayout (header + sidebar + content)
│       ├── pages/                 # SocialLinksPage, DungeonsPage, ExamsPage
│       ├── hooks/                 # useProgress (localStorage state)
│       ├── context/               # React Context (global progress state)
│       ├── types/                 # TypeScript interfaces
│       ├── utils/                 # Data fetcher helpers
│       └── data/                  # File JSON hasil scraping
│
├── 📁 data/                       # Output JSON terstruktur
│   ├── walkthrough.json           # 280 hari, 1875 entries
│   ├── dungeons.json              # 11 dungeon
│   ├── social_links.json          # 23 Social Links
│   ├── exams.json                 # Jawaban ujian
│   └── raw/                       # (gitignored) Cache HTML mentah
│
└── README.md
```

---

## 🚀 Quick Start

### Web App (Frontend)

```bash
cd webapp
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### Scraper (Opsional — hanya jika ingin re-scrape data)

```bash
cd scraper
python -m venv venv

# Aktivasi virtual environment
# Windows: .\venv\Scripts\Activate.ps1
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
playwright install chromium

# Jalankan scraper
python main.py --no-headless --sections walkthrough
python main.py --no-headless --sections all
```

> **Catatan:** GameFAQs menggunakan Cloudflare. Scraper menggunakan Playwright (headless browser) untuk mem-bypass proteksi ini. Jika CAPTCHA muncul, browser akan terbuka secara visible agar bisa diselesaikan secara manual.

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|:----------|:------|:-------|
| **React** | 19 | UI library |
| **Vite** | 8 | Build tool & dev server |
| **Tailwind CSS** | 4 | Utility-first styling |
| **TypeScript** | 6 | Type safety |

### Scraper
| Teknologi | Fungsi |
|:----------|:-------|
| **Python 3.14** | Runtime |
| **Playwright** | Browser automation + Cloudflare bypass |
| **BeautifulSoup4** | HTML parsing & data extraction |

### Arsitektur Komponen (Atomic Design)
Webapp menggunakan pola **Atomic Design** untuk organisasi komponen:
- **Atoms** → Elemen terkecil yang berdiri sendiri (`Button`, `SearchInput`, `ActivityEntry`)
- **Molecules** → Gabungan atom yang membentuk unit fungsional (`DayCard`, `MonthTab`, `DungeonCard`)
- **Organisms** → Gabungan molecules yang membentuk section (`DayList`, `MonthSelector`)
- **Templates** → Layout halaman (`MainLayout` dengan header, sidebar, dan area konten)

---

## 📊 Data yang Diekstrak

Data mentah dari guide Hurricanehaon berhasil dikonversi menjadi JSON terstruktur:

| File | Konten | Ukuran |
|:-----|:-------|:-------|
| `walkthrough.json` | 12 bulan + NG+, 280 hari, 1875 instruksi | ~375 KB |
| `dungeons.json` | 11 dungeon (termasuk Golden-exclusive) | ~3 KB |
| `social_links.json` | 23 Social Links + metadata Arcana | ~5 KB |
| `exams.json` | Jawaban ujian sekolah | ~2 KB |

---

## 🗺️ Roadmap

- [x] **Fase 1 — Data Extraction**: Scraper Python, Cloudflare bypass, parser HTML-to-JSON
- [x] **Fase 2 — Frontend Foundation**: Inisialisasi Vite + React + Tailwind, layout responsive dengan sidebar
- [x] **Fase 3 — Core Features**: Walkthrough timeline, progress tracker, search, halaman Dungeon/Social Link/Exam
- [ ] **Fase 4 — Polish & Deploy**: Micro-animations lanjutan, responsivitas mobile, PWA support, deploy ke Vercel/Netlify

---

## 📜 Lisensi & Disclaimer

Proyek ini dibuat semata-mata untuk **keperluan pembelajaran** (*web scraping*, *frontend development*, dan *UI/UX design*).

Seluruh konten panduan walkthrough Persona 4 Golden adalah hak cipta dari penulis aslinya, **[Hurricanehaon](https://gamefaqs.gamespot.com/community/Hurricanehaon)**, dan dipublikasikan di [GameFAQs](https://gamefaqs.gamespot.com/vita/641695-persona-4-golden/faqs/76145). Persona 4 Golden adalah milik **ATLUS / SEGA**.
