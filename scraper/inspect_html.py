import re, os, sys

html_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'walkthrough.html')
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

print(f"Total HTML size: {len(html)} chars\n")

# 1. Cari semua id attributes
ids = re.findall(r'id=["\']([^"\']+)["\']', html)
print("=== IDs found in HTML ===")
for i in sorted(set(ids)):
    print(f"  id={i!r}")

print()

# 2. Cari pola tanggal ~Month Day~
dates = re.findall(r'~(\w+\s+\d+(?:st|nd|rd|th)?)~', html)
print(f"=== Date patterns '~Month Day~' found: {len(dates)} ===")
print(dates[:15])

print()

# 3. Cari heading tags
headings = re.findall(r'<(h[1-4])[^>]*>(.*?)</h[1-4]>', html, re.DOTALL)
print(f"=== Headings found: {len(headings)} ===")
for tag, content in headings[:20]:
    text = re.sub(r'<[^>]+>', '', content).strip()[:80]
    print(f"  <{tag}>: {text!r}")

print()

# 4. Print snippet area yang likely mengandung April heading
idx = html.lower().find('april')
if idx >= 0:
    print(f"=== HTML around 'april' (pos {idx}) ===")
    print(html[max(0,idx-200):idx+500])
