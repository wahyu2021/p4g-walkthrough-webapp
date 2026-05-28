"""
Test parser langsung dari raw HTML yang sudah ada di disk.
Tidak membutuhkan Playwright/browser.
Jalankan dengan: python test_parser.py
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))

from parser import parse_walkthrough_by_month, MONTH_MAP

MONTH_ORDER = [
    "april", "may", "june", "july", "august", "september",
    "october", "november", "december", "january", "february", "march",
]

RAW_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')
html_path = os.path.join(RAW_DIR, 'walkthrough.html')

if not os.path.exists(html_path):
    print(f"[ERROR] File tidak ditemukan: {html_path}")
    print("        Jalankan scraper dulu: python main.py --sections walkthrough")
    sys.exit(1)

print(f"[OK] Membaca {os.path.getsize(html_path)//1024} KB dari {html_path}")
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

print("[OK] Parsing...")
months = parse_walkthrough_by_month(html, MONTH_ORDER)

print(f"\n=== HASIL ===")
print(f"Total bulan ter-parse: {len(months)}")
total_days = 0
total_entries = 0
for m in months:
    days = m.get('days', [])
    entries = sum(len(d.get('entries', [])) for d in days)
    total_days += len(days)
    total_entries += entries
    parsed_as = "blocks" if m.get('parsed_as_blocks') else f"{len(days)} hari, {entries} entries"
    print(f"  {m.get('month', '?'):12s}: {parsed_as}")

print(f"\nTotal hari   : {total_days}")
print(f"Total entries: {total_entries}")

if months and months[0].get('days'):
    print(f"\n=== Sample: April hari pertama ===")
    april = months[0]
    if april.get('days'):
        day = april['days'][0]
        print(f"  Tanggal: {day.get('date', '?')}")
        for e in day.get('entries', [])[:3]:
            print(f"  [{e.get('type','?')}] {e.get('title','')[:60]}")
            if e.get('content'):
                print(f"           {e.get('content','')[:80]}...")

# Simpan hasil ke file JSON untuk inspeksi
out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'walkthrough.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(months, f, ensure_ascii=False, indent=2)
print(f"\n[OK] Tersimpan: {out_path}")
