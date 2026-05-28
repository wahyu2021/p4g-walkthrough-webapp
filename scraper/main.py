# =============================================================================
# main.py — Entry point utama untuk P4G GameFAQs Scraper
# =============================================================================
#
# Cara pakai:
#   python main.py                        # Scrape semua sections (headless)
#   python main.py --no-headless          # Mode visible (browser terbuka)
#   python main.py --parse-only           # Hanya parse raw HTML yang sudah ada
#   python main.py --sections walkthrough # Hanya scrape section tertentu
#   python main.py --no-resume            # Mulai dari awal (hapus resume state)
#   python main.py --delay-min 2 --delay-max 5  # Custom delay
#
# =============================================================================

import asyncio
import argparse
import sys
import os
import json
import time

# Pastikan folder scraper ada di path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import (
    SECTIONS,
    DATA_DIR,
    RAW_DIR,
    OUTPUT_FILES,
    DELAY_MIN_SECONDS,
    DELAY_MAX_SECONDS,
)
from browser import BrowserManager
from fetcher import fetch_table_of_contents, fetch_all_sections, _sections_from_config
from structurer import structure_all, save_all_json, load_raw_htmls_from_disk


# ─── Filter Section berdasarkan kategori ─────────────────────────────────────

SECTION_GROUPS = {
    "walkthrough":  ["walkthrough"],
    "dungeons":     ["dungeons"],
    "social":       ["social_links"],
    "activities":   ["activities", "skill_list", "item_list", "tips", "conclusion"],
    "introduction": ["guide_100", "introduction", "about_p4g", "gameplay"],
    "personas":     ["persona_compendium"],
    "all":          list(SECTIONS.keys()),
}


def filter_sections(sections: list[dict], group: str) -> list[dict]:
    """Filter daftar sections berdasarkan kelompok yang diminta."""
    if group == "all":
        return sections

    allowed_keys = SECTION_GROUPS.get(group, [])
    if not allowed_keys:
        print(f"[⚠️] Group '{group}' tidak dikenal. Menggunakan 'all'.")
        return sections

    filtered = [s for s in sections if s.get("key", s.get("slug", "")) in allowed_keys]
    print(f"[🔍] Filter aktif: '{group}' → {len(filtered)} sections dipilih.")
    return filtered


# ─── Argument Parser ──────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="P4G GameFAQs Walkthrough Scraper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Contoh penggunaan:
  python main.py                           # Scrape semua (headless)
  python main.py --no-headless             # Browser visible (untuk debug/CAPTCHA)
  python main.py --parse-only              # Hanya parse raw HTML yang sudah ada
  python main.py --sections walkthrough    # Hanya scrape walkthrough (per bulan)
  python main.py --sections dungeons       # Hanya scrape dungeon sections
  python main.py --sections social         # Hanya scrape social link sections
  python main.py --no-resume               # Mulai dari awal, hapus semua cache
  python main.py --delay-min 5 --delay-max 10  # Delay lebih lambat (lebih aman)
        """,
    )

    parser.add_argument(
        "--headless",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Jalankan browser dalam mode headless (default: True)",
    )
    parser.add_argument(
        "--sections",
        choices=["all", "walkthrough", "dungeons", "social", "activities", "introduction"],
        default="all",
        help="Pilih kelompok section yang akan di-scrape (default: all)",
    )
    parser.add_argument(
        "--resume",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Lanjutkan scraping (skip section yang sudah ada) (default: True)",
    )
    parser.add_argument(
        "--parse-only",
        action="store_true",
        default=False,
        help="Hanya parsing raw HTML yang sudah ada, tanpa fetch dari internet",
    )
    parser.add_argument(
        "--delay-min",
        type=float,
        default=DELAY_MIN_SECONDS,
        help=f"Delay minimum antar request dalam detik (default: {DELAY_MIN_SECONDS})",
    )
    parser.add_argument(
        "--delay-max",
        type=float,
        default=DELAY_MAX_SECONDS,
        help=f"Delay maksimum antar request dalam detik (default: {DELAY_MAX_SECONDS})",
    )

    return parser.parse_args()


# ─── Main Function ────────────────────────────────────────────────────────────

async def run_scraper(args: argparse.Namespace):
    """Fungsi utama scraper yang mengorkestrasi seluruh proses."""

    start_time = time.time()

    print("=" * 65)
    print("  🎮 P4G GameFAQs Walkthrough Scraper")
    print("     Guide: Hurricanehaon — FAQ #76145")
    print("=" * 65)

    # Buat folder output
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(RAW_DIR,  exist_ok=True)

    # Override config delay jika dipass via CLI
    import config as cfg
    cfg.DELAY_MIN_SECONDS = args.delay_min
    cfg.DELAY_MAX_SECONDS = args.delay_max

    # ── Mode: Parse Only (tanpa fetch) ──────────────────────────────────────
    if args.parse_only:
        print("\n[📂] Mode PARSE-ONLY: Memuat raw HTML dari disk...")
        raw_sections = load_raw_htmls_from_disk()
        if not raw_sections:
            print("[❌] Tidak ada raw HTML ditemukan. Jalankan tanpa --parse-only dulu.")
            return
        print(f"[✅] {len(raw_sections)} sections dimuat.")
        structured = structure_all(raw_sections)
        save_all_json(structured)
        _print_summary(structured, start_time)
        return

    # ── Mode: Full Scrape ────────────────────────────────────────────────────
    print(f"\n[⚙️] Konfigurasi:")
    print(f"     Headless  : {'Ya' if args.headless else 'Tidak (visible)'}")
    print(f"     Sections  : {args.sections}")
    print(f"     Resume    : {'Ya' if args.resume else 'Tidak (mulai dari awal)'}")
    print(f"     Delay     : {args.delay_min}s – {args.delay_max}s")

    if not args.resume:
        _clear_raw_cache()

    async with BrowserManager(headless=args.headless) as browser:
        # Ambil Table of Contents
        page = await browser.new_page()
        toc_sections = await fetch_table_of_contents(page, browser)
        await page.close()

        # Tambahkan "key" ke setiap entry TOC jika belum ada
        for section in toc_sections:
            if "key" not in section:
                # Cari key dari config berdasarkan slug
                slug = section.get("slug", "")
                matched_key = next(
                    (k for k, v in SECTIONS.items() if v == slug),
                    slug,
                )
                section["key"] = matched_key

        # Jika TOC kosong atau fetch gagal, gunakan config
        if not toc_sections:
            toc_sections = _sections_from_config()

        # Filter berdasarkan kelompok yang diminta
        filtered_sections = filter_sections(toc_sections, args.sections)

        if not filtered_sections:
            print("[❌] Tidak ada section untuk di-scrape setelah filter.")
            return

        # Fetch semua sections
        raw_sections = await fetch_all_sections(
            browser_manager=browser,
            sections=filtered_sections,
            resume=args.resume,
        )

        # Jika tidak ada yang berhasil di-fetch tapi ada di disk (resume case)
        if not raw_sections:
            print("[⚠️] Tidak ada section baru yang di-fetch. Mencoba load dari disk...")
            raw_sections = load_raw_htmls_from_disk()

    # ── Structure & Save ─────────────────────────────────────────────────────
    if raw_sections:
        structured = structure_all(raw_sections)
        save_all_json(structured)
        _print_summary(structured, start_time)
    else:
        print("\n[❌] Tidak ada data yang berhasil di-fetch atau di-parse.")
        print("     Tips:")
        print("     1. Coba jalankan dengan --no-headless untuk melihat apa yang terjadi")
        print("     2. Cek koneksi internet Anda")
        print("     3. Jika ada CAPTCHA, selesaikan manual saat browser terbuka")


def _clear_raw_cache():
    """Hapus semua file raw HTML cache."""
    if os.path.exists(RAW_DIR):
        import shutil
        shutil.rmtree(RAW_DIR)
        os.makedirs(RAW_DIR, exist_ok=True)
        print("[🗑️] Cache raw HTML dihapus.")


def _print_summary(structured: dict, start_time: float):
    """Print ringkasan hasil scraping."""
    elapsed = time.time() - start_time
    minutes, seconds = divmod(int(elapsed), 60)

    print("\n" + "=" * 65)
    print("  ✅ SCRAPING SELESAI!")
    print("=" * 65)

    # Statistik
    walkthrough = structured.get("walkthrough", [])
    dungeons    = structured.get("dungeons", [])
    sl          = structured.get("social_links", [])
    exams       = structured.get("exams", [])
    tips        = structured.get("tips", [])

    total_days = sum(len(m.get("days", [])) for m in walkthrough)

    print(f"\n  📊 Statistik Hasil:")
    print(f"     📅 Walkthrough : {len(walkthrough)} bulan, {total_days} hari")
    print(f"     ⚔️  Dungeons    : {len(dungeons)}")
    print(f"     💬 Social Links: {len(sl)}")
    print(f"     📝 Exam Q&As   : {len(exams)}")
    print(f"     💡 Tips        : {len(tips)}")
    print(f"\n  ⏱️  Total waktu  : {minutes}m {seconds}s")
    print(f"\n  📁 Output tersimpan di: {DATA_DIR}")
    print()

    # Cek raw files
    raw_count = 0
    if os.path.exists(RAW_DIR):
        raw_count = len([f for f in os.listdir(RAW_DIR) if f.endswith(".html")])
    print(f"  📦 Raw HTML files: {raw_count} file di {RAW_DIR}")
    print()

    # Cek apakah ada sections yang gagal
    failed_sections = []
    for key in SECTIONS:
        raw_path = os.path.join(RAW_DIR, f"{key}.html")
        if not os.path.exists(raw_path):
            failed_sections.append(key)

    if failed_sections:
        print(f"  ⚠️  {len(failed_sections)} sections tidak berhasil di-fetch:")
        for s in failed_sections[:10]:
            print(f"      - {s}")
        if len(failed_sections) > 10:
            print(f"      ... dan {len(failed_sections) - 10} lainnya")
        print()
        print("  💡 Untuk mencoba ulang sections yang gagal:")
        print("     python main.py --resume")
    else:
        print("  🎉 Semua sections berhasil di-fetch!")

    print("=" * 65)


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    args = parse_args()
    asyncio.run(run_scraper(args))
