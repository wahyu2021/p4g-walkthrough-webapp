# =============================================================================
# fetcher.py — Mengambil halaman dari GameFAQs dengan handling error & retry
# =============================================================================

import asyncio
import os
import random
import re
from playwright.async_api import Page, TimeoutError as PlaywrightTimeoutError

from config import (
    BASE_URL,
    SECTIONS,
    CONTENT_SELECTORS,
    TOC_SELECTORS,
    DELAY_MIN_SECONDS,
    DELAY_MAX_SECONDS,
    MAX_RETRIES,
    RETRY_DELAY,
    PAGE_LOAD_TIMEOUT,
    CONTENT_WAIT_TIMEOUT,
    RAW_DIR,
)
from browser import BrowserManager, is_cloudflare_challenge, wait_for_cloudflare


# ─── Helper Functions ─────────────────────────────────────────────────────────

def get_section_url(slug: str) -> str:
    """Buat URL lengkap dari slug section."""
    return f"{BASE_URL}/{slug}"


def get_raw_filepath(section_key: str) -> str:
    """Dapatkan path file HTML raw untuk section tertentu."""
    return os.path.join(RAW_DIR, f"{section_key}.html")


def is_already_downloaded(section_key: str) -> bool:
    """Cek apakah section sudah pernah didownload (untuk resume support)."""
    filepath = get_raw_filepath(section_key)
    if os.path.exists(filepath) and os.path.getsize(filepath) > 500:
        return True
    return False


def load_raw_html(section_key: str) -> str | None:
    """Load HTML raw yang sudah tersimpan di disk."""
    filepath = get_raw_filepath(section_key)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    return None


def save_raw_html(section_key: str, html: str):
    """Simpan HTML raw ke disk."""
    os.makedirs(RAW_DIR, exist_ok=True)
    filepath = get_raw_filepath(section_key)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)


async def random_delay():
    """Tunggu random delay untuk menghindari rate limiting."""
    delay = random.uniform(DELAY_MIN_SECONDS, DELAY_MAX_SECONDS)
    print(f"  [💤] Menunggu {delay:.1f} detik...")
    await asyncio.sleep(delay)


async def find_content_element(page: Page) -> str | None:
    """
    Coba berbagai CSS selector untuk menemukan elemen konten FAQ.
    Return HTML string dari elemen yang ditemukan, atau None jika tidak ada.
    """
    for selector in CONTENT_SELECTORS:
        try:
            element = await page.query_selector(selector)
            if element:
                html = await element.inner_html()
                if html and len(html.strip()) > 200:  # Pastikan ada konten substantif
                    return html
        except Exception:
            continue

    # Fallback: ambil seluruh body
    try:
        body = await page.query_selector("body")
        if body:
            return await body.inner_html()
    except Exception:
        pass

    return None


# ─── TOC Fetcher ──────────────────────────────────────────────────────────────

async def fetch_table_of_contents(page: Page, browser_manager: BrowserManager) -> list[dict]:
    """
    Fetch halaman utama guide dan extract semua link dari Table of Contents.

    Return:
        List of dict: [{"key": str, "label": str, "url": str, "slug": str}]
    """
    print(f"\n[📋] Mengambil Table of Contents dari: {BASE_URL}")
    url = BASE_URL

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            await page.goto(url, timeout=PAGE_LOAD_TIMEOUT, wait_until="domcontentloaded")
            await asyncio.sleep(3)  # Tunggu JS settle

            # Cek Cloudflare challenge
            if await is_cloudflare_challenge(page):
                cf_cleared = await wait_for_cloudflare(page, timeout=30)
                if not cf_cleared:
                    print("  [⚠️] Cloudflare tidak selesai otomatis.")
                    page = await browser_manager.switch_to_visible()
                    input("  Selesaikan challenge, lalu tekan ENTER untuk melanjutkan... ")
                    await page.goto(url, timeout=PAGE_LOAD_TIMEOUT, wait_until="domcontentloaded")
                    await asyncio.sleep(3)

            # Extract TOC links
            toc_links = await _extract_toc_links(page)
            if toc_links:
                print(f"  [✅] Ditemukan {len(toc_links)} section dalam TOC.")
                return toc_links
            else:
                print("  [⚠️] TOC kosong atau tidak ditemukan. Menggunakan SECTIONS dari config.")
                return _sections_from_config()

        except PlaywrightTimeoutError:
            print(f"  [❌] Timeout (percobaan {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY)
        except Exception as e:
            print(f"  [❌] Error: {e} (percobaan {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY)

    # Fallback ke config
    print("  [⚠️] Menggunakan section list dari config.py sebagai fallback.")
    return _sections_from_config()


async def _extract_toc_links(page: Page) -> list[dict]:
    """Extract links dari Table of Contents di halaman guide."""
    links = []

    # Coba extract dari elemen TOC
    for selector in TOC_SELECTORS + [".ftoc a", ".toc a", ".faqtext a"]:
        try:
            elements = await page.query_selector_all(selector)
            if elements:
                for el in elements:
                    href = await el.get_attribute("href")
                    text = await el.inner_text()
                    if href and "/faqs/76145/" in href and text.strip():
                        slug = href.split("/faqs/76145/")[-1].split("?")[0].strip("/")
                        if slug and slug not in [l["slug"] for l in links]:
                            links.append({
                                "slug": slug,
                                "label": text.strip(),
                                "url": f"https://gamefaqs.gamespot.com{href.split('?')[0]}",
                            })
                if links:
                    break
        except Exception:
            continue

    return links


def _sections_from_config() -> list[dict]:
    """Buat list sections dari config SECTIONS dict."""
    result = []
    for key, slug in SECTIONS.items():
        result.append({
            "key": key,
            "slug": slug,
            "label": key.replace("_", " ").title(),
            "url": get_section_url(slug),
        })
    return result


# ─── Section Fetcher ──────────────────────────────────────────────────────────

async def fetch_section(
    page: Page,
    browser_manager: BrowserManager,
    section_key: str,
    slug: str,
    total: int,
    current: int,
    resume: bool = True,
) -> str | None:
    """
    Fetch satu section dari guide dan simpan HTML raw-nya ke disk.

    Args:
        page: Playwright page instance
        browser_manager: BrowserManager untuk fallback
        section_key: Key unik section (misal: "walkthrough_april")
        slug: URL slug section (misal: "april")
        total: Total jumlah section (untuk progress display)
        current: Nomor section saat ini (untuk progress display)
        resume: Jika True, skip section yang sudah didownload

    Return:
        HTML string konten section, atau None jika gagal
    """
    prefix = f"[{current:02d}/{total:02d}]"
    url = get_section_url(slug)

    # Resume: cek apakah sudah pernah didownload
    if resume and is_already_downloaded(section_key):
        print(f"{prefix} [⏭️] Skip (sudah ada): {section_key}")
        return load_raw_html(section_key)

    print(f"{prefix} [🔍] Mengambil section: {section_key} ({slug})")
    print(f"         URL: {url}")

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            # Navigate ke halaman section
            response = await page.goto(
                url,
                timeout=PAGE_LOAD_TIMEOUT,
                wait_until="domcontentloaded",
            )

            # Cek HTTP status
            if response and response.status == 404:
                print(f"  [❌] 404 Not Found untuk slug '{slug}'. Skip section ini.")
                return None

            await asyncio.sleep(2)  # Tunggu JS settle

            # Cek Cloudflare challenge
            if await is_cloudflare_challenge(page):
                print("  [⚠️] Terdeteksi Cloudflare challenge!")
                cf_cleared = await wait_for_cloudflare(page, timeout=30)
                if not cf_cleared:
                    print("  [⚠️] Memerlukan interaksi manual.")
                    page = await browser_manager.switch_to_visible()
                    await page.goto(url, timeout=PAGE_LOAD_TIMEOUT, wait_until="domcontentloaded")
                    input(
                        "  Buka browser dan selesaikan challenge/CAPTCHA,\n"
                        "  lalu tekan ENTER di terminal ini untuk melanjutkan... "
                    )
                    await asyncio.sleep(3)

            # Tunggu konten FAQ muncul
            content_loaded = False
            for selector in CONTENT_SELECTORS:
                try:
                    await page.wait_for_selector(selector, timeout=CONTENT_WAIT_TIMEOUT)
                    content_loaded = True
                    break
                except PlaywrightTimeoutError:
                    continue

            if not content_loaded:
                print(f"  [⚠️] Konten selector tidak ditemukan, mencoba ambil body...")

            # Extract HTML konten
            html_content = await find_content_element(page)

            if html_content and len(html_content.strip()) > 200:
                # Simpan raw HTML ke disk
                save_raw_html(section_key, html_content)
                size_kb = len(html_content.encode("utf-8")) / 1024
                print(f"  [✅] Berhasil! ({size_kb:.1f} KB)")

                # Delay sebelum request berikutnya
                await random_delay()
                return html_content
            else:
                print(f"  [⚠️] Konten terlalu pendek atau kosong (attempt {attempt}/{MAX_RETRIES})")
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(RETRY_DELAY)

        except PlaywrightTimeoutError:
            print(f"  [❌] Timeout (attempt {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY)
        except Exception as e:
            print(f"  [❌] Error: {type(e).__name__}: {e} (attempt {attempt}/{MAX_RETRIES})")
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_DELAY)

    print(f"  [💀] GAGAL setelah {MAX_RETRIES} percobaan: {section_key}")
    return None


# ─── Batch Fetcher ────────────────────────────────────────────────────────────

async def fetch_all_sections(
    browser_manager: BrowserManager,
    sections: list[dict],
    resume: bool = True,
) -> dict[str, str]:
    """
    Fetch semua sections secara berurutan.

    Return:
        Dict mapping section_key → HTML content string
    """
    results: dict[str, str] = {}
    total = len(sections)

    page = await browser_manager.new_page()

    # Kunjungi homepage dulu untuk mendapatkan cookies awal
    print("\n[🏠] Mengunjungi homepage GameFAQs untuk inisialisasi cookies...")
    try:
        await page.goto("https://gamefaqs.gamespot.com", timeout=PAGE_LOAD_TIMEOUT, wait_until="domcontentloaded")
        await asyncio.sleep(3)
    except Exception as e:
        print(f"  [⚠️] Homepage visit gagal: {e}, melanjutkan...")

    print(f"\n[🚀] Mulai fetch {total} sections...\n")

    for i, section in enumerate(sections, start=1):
        key  = section.get("key") or section.get("slug", f"section_{i}")
        slug = section.get("slug", "")

        if not slug:
            print(f"[{i:02d}/{total:02d}] [⏭️] Skip: slug kosong untuk '{key}'")
            continue

        html = await fetch_section(
            page=page,
            browser_manager=browser_manager,
            section_key=key,
            slug=slug,
            total=total,
            current=i,
            resume=resume,
        )

        if html:
            results[key] = html

    await page.close()
    return results
