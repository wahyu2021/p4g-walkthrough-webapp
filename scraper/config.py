# =============================================================================
# config.py — Semua konfigurasi untuk P4G GameFAQs Scraper
# =============================================================================

import os

# ─── URL Utama ────────────────────────────────────────────────────────────────
BASE_URL = "https://gamefaqs.gamespot.com/vita/641695-persona-4-golden/faqs/76145"

# ─── Section URLs (slug setelah /faqs/76145/) ─────────────────────────────────
# Berdasarkan TOC GameFAQs, guide ini terbagi ke beberapa HALAMAN BESAR.
# Setiap bulan/dungeon/social-link adalah ANCHOR (#section) dalam 1 halaman,
# bukan halaman terpisah.
#
# Contoh URL nyata:
#   https://gamefaqs.gamespot.com/vita/641695-persona-4-golden/faqs/76145/walkthrough
#   (berisi semua bulan: April–Maret + NG+, diakses via #april, #may, dst)
#
SECTIONS = {
    # ── Info & Basics (masing-masing 1 halaman) ──
    "guide_100":          "100-guide",
    "introduction":       "introduction",
    "about_p4g":          "about-persona-4-golden",
    "gameplay":           "gameplay-mechanics",

    # ── Walkthrough (SEMUA bulan April–Maret ada di 1 halaman) ──
    "walkthrough":        "walkthrough",

    # ── Dungeons (SEMUA dungeon ada di 1 halaman) ──
    "dungeons":           "dungeons",

    # ── Persona Compendium (1 halaman) ──
    "persona_compendium": "persona-compendium",

    # ── Social Links (SEMUA SL ada di 1 halaman) ──
    "social_links":       "social-links",

    # ── Activities (1 halaman, berisi quests, fishing, dll) ──
    "activities":         "activities",

    # ── Referensi ──
    "skill_list":         "skill-list",
    "item_list":          "item-list",
    "tips":               "tips-and-tricks",
    "conclusion":         "conclusion",
}

# Anchor IDs dalam setiap halaman besar (untuk referensi parser)
# Format: {section_key: {subsection_label: anchor_id}}
SECTION_ANCHORS = {
    "walkthrough": {
        "april":     "april",
        "may":       "may",
        "june":      "june",
        "july":      "july",
        "august":    "august",
        "september": "september",
        "october":   "october",
        "november":  "november",
        "december":  "december",
        "january":   "january",
        "february":  "february",
        "march":     "march",
        "ng_plus":   "new-game-plus-walkthrough",
    },
    "dungeons": {
        "shopping":  "twisted-shopping-district",
        "yukiko":    "yukikos-castle",
        "bathhouse": "steamy-bathhouse",
        "marukyu":   "marukyu-striptease",
        "void":      "void-quest",
        "lab":       "secret-laboratory",
        "heaven":    "heaven",
        "magatsu":   "magatsu-inaba",
        "hollow":    "hollow-forest",
        "yomotsu":   "yomotsu-hirasaka",
        "bosses":    "extra-bosses",
    },
    "social_links": {
        "fool":        "investigation-team-fool",
        "magician":    "yosuke-hanamura-magician",
        "priestess":   "yukiko-amagi-priestess",
        "empress":     "margaret-empress",
        "emperor":     "kanji-tatsumi-emperor",
        "hierophant":  "ryotaro-dojima-hierophant",
        "lovers":      "rise-kujikawa-lovers",
        "chariot":     "chie-satonaka-chariot",
        "justice":     "nanako-dojima-justice",
        "hermit":      "fox-hermit",
        "fortune":     "naoto-shirogane-fortune",
        "strength":    "fellow-athletes-strength",
        "hanged":      "sakis-brother-hanged-man",
        "death":       "old-lady-death",
        "temperance":  "young-mother-temperance",
        "devil":       "nurse-devil",
        "tower":       "tutored-student-tower",
        "star":        "teddie-star",
        "moon":        "ai-ebihara-moon",
        "sun":         "yumi-ozawa-and-ayane-matsunaga-sun",
        "judgement":   "seekers-of-truth-judgement",
        "jester":      "tohru-adachi-jester",
        "aeon":        "marie-aeon",
    },
}

# ─── CSS Selectors ────────────────────────────────────────────────────────────
# Selector untuk konten utama guide di GameFAQs
CONTENT_SELECTORS = [
    ".faqtext",          # Selector utama untuk konten FAQ
    "#faqwrap",          # Wrapper FAQ
    ".faqbody",          # Body FAQ
    "article",           # Tag artikel generik
    ".body-text",        # Konten teks
]

# Selector untuk Table of Contents
TOC_SELECTORS = [
    ".ftoc",             # FAQ Table of Contents
    ".toc",              # Generic TOC
    "nav",               # Navigation element
]

# ─── Browser Settings ────────────────────────────────────────────────────────
BROWSER_CONFIG = {
    "headless": True,         # Ubah ke False jika perlu mode visible
    "viewport": {
        "width": 1920,
        "height": 1080
    },
    "locale": "en-US",
    "timezone": "Asia/Jakarta",
    "user_agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}

# ─── Rate Limiting ────────────────────────────────────────────────────────────
DELAY_MIN_SECONDS = 3.0    # Delay minimum antar request
DELAY_MAX_SECONDS = 7.0    # Delay maksimum antar request
MAX_RETRIES       = 3      # Jumlah retry jika request gagal
RETRY_DELAY       = 10.0   # Delay setelah gagal (detik)

# ─── Timeout Settings ─────────────────────────────────────────────────────────
PAGE_LOAD_TIMEOUT   = 60_000   # 60 detik (ms)
CONTENT_WAIT_TIMEOUT = 30_000  # 30 detik (ms)

# ─── Output Paths ─────────────────────────────────────────────────────────────
# Folder project root (satu level di atas scraper/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR     = os.path.join(PROJECT_ROOT, "data")
RAW_DIR      = os.path.join(DATA_DIR, "raw")
OUTPUT_FILES = {
    "walkthrough":   os.path.join(DATA_DIR, "walkthrough.json"),
    "dungeons":      os.path.join(DATA_DIR, "dungeons.json"),
    "social_links":  os.path.join(DATA_DIR, "social_links.json"),
    "exams":         os.path.join(DATA_DIR, "exams.json"),
    "activities":    os.path.join(DATA_DIR, "activities.json"),
    "tips":          os.path.join(DATA_DIR, "tips.json"),
    "introduction":  os.path.join(DATA_DIR, "introduction.json"),
}

# ─── Cloudflare Detection Strings ─────────────────────────────────────────────
CLOUDFLARE_INDICATORS = [
    "Just a moment",
    "Checking your browser",
    "cf-browser-verification",
    "cf-spinner",
    "challenge-platform",
    "ray ID",
    "cloudflare",
]
