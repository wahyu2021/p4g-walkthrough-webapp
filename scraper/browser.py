# =============================================================================
# browser.py — Setup Playwright browser dengan anti-detection stealth
# =============================================================================

import asyncio
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from config import BROWSER_CONFIG, CLOUDFLARE_INDICATORS


# Script stealth yang di-inject ke setiap halaman sebelum load
# Tujuan: menyembunyikan tanda-tanda browser automation dari Cloudflare
STEALTH_SCRIPT = """
() => {
    // 1. Sembunyikan navigator.webdriver flag
    Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
    });

    // 2. Spoof plugins (browser asli punya plugins, headless tidak)
    Object.defineProperty(navigator, 'plugins', {
        get: () => [
            { name: 'Chrome PDF Plugin',  filename: 'internal-pdf-viewer' },
            { name: 'Chrome PDF Viewer',  filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
            { name: 'Native Client',      filename: 'internal-nacl-plugin' },
        ],
    });

    // 3. Spoof languages
    Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
    });

    // 4. Override permissions query agar tidak terdeteksi sebagai headless
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters)
    );

    // 5. Hapus $cdc_ property (indikator ChromeDriver)
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
    delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;

    // 6. Override chrome object
    window.chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {},
    };

    // 7. Spoof connection type
    if (navigator.connection) {
        Object.defineProperty(navigator.connection, 'rtt', { get: () => 50 });
    }
}
"""


async def is_cloudflare_challenge(page: Page) -> bool:
    """
    Cek apakah halaman yang di-load adalah Cloudflare challenge page.
    HANYA cek title dan elemen DOM khusus CF challenge —
    JANGAN cek seluruh HTML karena GameFAQs (Cloudflare CDN) akan selalu
    mengandung kata 'cloudflare' di script/footer pada halaman normal.
    """
    try:
        # Cek 1: Title halaman (paling reliable)
        title = await page.title()
        CF_CHALLENGE_TITLES = ["just a moment", "attention required", "access denied", "checking your browser"]
        if any(t in title.lower() for t in CF_CHALLENGE_TITLES):
            return True

        # Cek 2: Elemen DOM yang spesifik untuk CF challenge page
        CF_CHALLENGE_SELECTORS = [
            "#cf-challenge-running",
            "#challenge-running",
            ".cf-browser-verification",
            "#challenge-form",
            "input[name='cf_captcha_kind']",
            "#cf-hcaptcha-container",
        ]
        for sel in CF_CHALLENGE_SELECTORS:
            el = await page.query_selector(sel)
            if el:
                return True

        return False
    except Exception:
        return False


async def wait_for_cloudflare(page: Page, timeout: int = 30) -> bool:
    """
    Tunggu Cloudflare challenge selesai secara otomatis.
    Beberapa challenge diselesaikan otomatis oleh Cloudflare dalam beberapa detik.
    Return True jika berhasil melewati, False jika timeout.
    """
    print("  [⏳] Menunggu Cloudflare challenge selesai otomatis...")
    for i in range(timeout):
        await asyncio.sleep(1)
        if not await is_cloudflare_challenge(page):
            print(f"  [✅] Cloudflare challenge selesai setelah {i+1} detik.")
            return True
        if i % 5 == 0 and i > 0:
            print(f"  [⏳] Masih menunggu... ({i}/{timeout}s)")
    return False


class BrowserManager:
    """
    Manager untuk Playwright browser instance.
    Menangani lifecycle browser (start, stop) dan stealth setup.
    """

    def __init__(self, headless: bool | None = None):
        self.headless = headless if headless is not None else BROWSER_CONFIG["headless"]
        self._playwright = None
        self._browser: Browser | None = None
        self._context: BrowserContext | None = None

    async def start(self) -> "BrowserManager":
        """Mulai browser dan buat context dengan stealth settings."""
        mode_str = "headless" if self.headless else "visible (non-headless)"
        print(f"[🌐] Memulai browser Chromium dalam mode {mode_str}...")

        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(
            headless=self.headless,
            args=[
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--no-first-run",
                "--ignore-certificate-errors",
                "--disable-web-security",
            ],
        )

        await self._create_context()
        print("[✅] Browser berhasil dimulai.")
        return self

    async def _create_context(self):
        """Buat browser context dengan konfigurasi stealth."""
        self._context = await self._browser.new_context(
            viewport=BROWSER_CONFIG["viewport"],
            locale=BROWSER_CONFIG["locale"],
            timezone_id=BROWSER_CONFIG["timezone"],
            user_agent=BROWSER_CONFIG["user_agent"],
            # Aktifkan cookies dan storage
            java_script_enabled=True,
            # Header tambahan agar terlihat seperti browser nyata
            extra_http_headers={
                "Accept": (
                    "text/html,application/xhtml+xml,application/xml;"
                    "q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
                ),
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "DNT": "1",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
            },
        )
        # Inject stealth script ke setiap halaman sebelum konten di-load
        await self._context.add_init_script(STEALTH_SCRIPT)

    async def new_page(self) -> Page:
        """Buat page baru dalam context yang sudah ada."""
        if self._context is None:
            raise RuntimeError("Browser belum distart. Panggil start() terlebih dahulu.")
        page = await self._context.new_page()
        return page

    async def switch_to_visible(self) -> Page:
        """
        Switch ke mode visible (non-headless) untuk manual CAPTCHA solving.
        Menutup browser lama dan membuka yang baru dalam mode visible.
        Mengembalikan page baru yang siap digunakan.
        """
        print("\n[⚠️] Beralih ke mode VISIBLE untuk manual challenge solving...")
        print("     Sebuah browser window akan terbuka. Selesaikan challenge yang muncul.")
        print("     Setelah halaman dimuat dengan benar, tekan ENTER di terminal ini.")
        await self.stop()
        self.headless = False
        await self.start()
        return await self.new_page()

    async def save_cookies(self, filepath: str):
        """Simpan cookies ke file untuk reuse di session berikutnya."""
        if self._context:
            import json
            cookies = await self._context.cookies()
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(cookies, f, indent=2)
            print(f"[💾] Cookies disimpan ke {filepath}")

    async def load_cookies(self, filepath: str):
        """Load cookies dari file yang sudah disimpan sebelumnya."""
        import json
        import os
        if self._context and os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                cookies = json.load(f)
            await self._context.add_cookies(cookies)
            print(f"[🍪] Cookies dimuat dari {filepath}")

    async def stop(self):
        """Tutup browser dan bersihkan semua resources."""
        if self._context:
            await self._context.close()
            self._context = None
        if self._browser:
            await self._browser.close()
            self._browser = None
        if self._playwright:
            await self._playwright.stop()
            self._playwright = None

    async def __aenter__(self) -> "BrowserManager":
        return await self.start()

    async def __aexit__(self, *args):
        await self.stop()
