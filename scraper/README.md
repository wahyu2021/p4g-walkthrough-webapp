# 🎮 P4G GameFAQs Walkthrough Scraper

Tool Python untuk mengambil konten walkthrough **Persona 4 Golden** dari GameFAQs
(Guide oleh Hurricanehaon — FAQ #76145) dan menyimpannya sebagai file JSON terstruktur.

---

## 📁 Struktur File

```
scraper/
├── main.py          ← Entry point, jalankan ini
├── browser.py       ← Setup Playwright + stealth anti-detection
├── fetcher.py       ← Fetch halaman + retry + resume support
├── parser.py        ← Parse HTML → Python dict (BeautifulSoup)
├── structurer.py    ← Transform parsed data → format JSON final
├── config.py        ← URL, selectors, settings
└── requirements.txt ← Dependencies

data/               ← Output (dibuat otomatis)
├── raw/            ← HTML mentah per section (cache)
├── walkthrough.json
├── dungeons.json
├── social_links.json
├── exams.json
├── activities.json
└── tips.json
```

---

## ⚙️ Setup (dilakukan manual oleh pengguna)

```bash
# 1. Buat dan aktifkan virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Install browser Chromium untuk Playwright
playwright install chromium
```

---

## 🚀 Cara Pakai

```bash
# Masuk ke folder scraper
cd scraper

# ── Penggunaan Dasar ──────────────────────────────────────

# Scrape semua sections (mode headless, browser tidak terlihat)
python main.py

# Mode visible — browser terbuka, bisa lihat prosesnya
# Gunakan ini jika kena Cloudflare CAPTCHA
python main.py --no-headless

# ── Filter Section ────────────────────────────────────────

# Hanya scrape walkthrough (per bulan: April–Maret)
python main.py --sections walkthrough

# Hanya scrape dungeon guides
python main.py --sections dungeons

# Hanya scrape social link guides
python main.py --sections social

# Hanya scrape tips & activities
python main.py --sections activities

# ── Resume & Retry ────────────────────────────────────────

# Lanjutkan dari section yang belum selesai (default: aktif)
python main.py --resume

# Mulai dari awal (hapus semua cache)
python main.py --no-resume

# ── Parse Ulang Tanpa Download ────────────────────────────

# Jika sudah punya raw HTML tapi ingin re-parse
# (berguna saat parser diupdate)
python main.py --parse-only

# ── Custom Delay ──────────────────────────────────────────

# Delay lebih lambat (lebih aman dari rate limiting)
python main.py --delay-min 5 --delay-max 12
```

---

## 🛡️ Handling Cloudflare

GameFAQs dilindungi Cloudflare. Tool ini menanganinya dengan:

1. **Stealth scripts** — menyembunyikan tanda-tanda automation dari browser
2. **Auto-wait** — menunggu 30 detik jika ada challenge otomatis
3. **Manual fallback** — jika masih terblokir, jalankan:
   ```bash
   python main.py --no-headless
   ```
   Browser akan terbuka dan Anda bisa menyelesaikan CAPTCHA secara manual.
   Setelah halaman ter-load, tekan **ENTER** di terminal untuk melanjutkan.

---

## 📊 Output JSON

### `walkthrough.json`
```json
[
  {
    "month": "april",
    "month_num": 4,
    "days": [
      {
        "date": "4/11",
        "day_num": 11,
        "month_num": 4,
        "entries": [
          {
            "type": "story",
            "title": "Arrival in Inaba",
            "content": "..."
          }
        ]
      }
    ]
  }
]
```

### `dungeons.json`
```json
[
  {
    "id": "yukikos-castle",
    "name": "Yukiko's Castle",
    "deadline": "4/29",
    "order": 1,
    "floors_count": 8,
    "recommended_level": 15,
    "boss": {
      "name": "Shadow Yukiko",
      "weaknesses": ["Ice"],
      "strategy": "..."
    },
    "floors": [...]
  }
]
```

### `social_links.json`
```json
[
  {
    "id": "yosuke-hanamura",
    "arcana": "Magician",
    "arcana_num": 1,
    "character": "Yosuke Hanamura",
    "start_date": "4/16",
    "ranks": [
      {
        "rank": 1,
        "choices": [
          {"text": "...", "points": 3, "is_best": true}
        ],
        "notes": "..."
      }
    ]
  }
]
```

---

## ❓ Troubleshooting

| Problem | Solusi |
|:--------|:-------|
| Error 403 / Cloudflare | Jalankan `--no-headless`, selesaikan CAPTCHA manual |
| Playwright tidak terinstall | `playwright install chromium` |
| Module not found | Pastikan venv aktif, `pip install -r requirements.txt` |
| Section selalu gagal | Cek slug URL di `config.py`, mungkin sudah berubah |
| JSON kosong / data sedikit | Jalankan `--parse-only` setelah fix parser |
| Script berhenti di tengah | Jalankan ulang, `--resume` aktif by default |

---

## 📝 Catatan

- Scraping dilakukan dengan **rate limiting sopan** (delay 3–7 detik per request)
- Raw HTML disimpan di `data/raw/` sebagai cache — tidak perlu re-download jika sudah ada
- Tool ini dibuat untuk **penggunaan personal** saja
- Jika slug URL berubah (GameFAQs update), edit `SECTIONS` dict di `config.py`
