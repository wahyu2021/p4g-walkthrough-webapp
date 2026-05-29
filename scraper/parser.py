# =============================================================================
# parser.py — Parsing HTML mentah menjadi data terstruktur (Python dict/list)
# =============================================================================

import re
from bs4 import BeautifulSoup, Tag


# ─── Helper Umum ─────────────────────────────────────────────────────────────

def make_soup(html: str) -> BeautifulSoup:
    """Buat BeautifulSoup object dari HTML string."""
    return BeautifulSoup(html, "lxml")


def clean_text(text: str) -> str:
    """Bersihkan whitespace berlebih dari teks."""
    if not text:
        return ""
    # Ganti multiple whitespace/newline dengan single space, lalu strip
    text = re.sub(r"\s+", " ", text).strip()
    return text


def element_to_text(el) -> str:
    """Extract dan bersihkan teks dari elemen BeautifulSoup."""
    if el is None:
        return ""
    return clean_text(el.get_text(separator=" "))


def extract_headings_and_blocks(soup: BeautifulSoup) -> list[dict]:
    """
    Extract semua heading (h1–h4) beserta konten paragraf/list setelahnya.
    Return list of {"level": int, "title": str, "content_blocks": list[str]}
    """
    result = []
    all_top_elements = soup.find_all(["h1", "h2", "h3", "h4", "p", "ul", "ol", "table", "pre", "div"])

    current_heading = None
    current_blocks = []
    current_level = 0

    for el in all_top_elements:
        tag = el.name.lower()

        if tag in ("h1", "h2", "h3", "h4"):
            # Simpan heading sebelumnya
            if current_heading is not None:
                result.append({
                    "level": current_level,
                    "title": current_heading,
                    "content_blocks": current_blocks,
                })
            current_heading = clean_text(el.get_text())
            current_level = int(tag[1])
            current_blocks = []

        elif current_heading is not None:
            text = clean_text(el.get_text(separator="\n"))
            if text and len(text) > 5:
                current_blocks.append(text)

    # Simpan heading terakhir
    if current_heading is not None:
        result.append({
            "level": current_level,
            "title": current_heading,
            "content_blocks": current_blocks,
        })

    return result


# ─── Walkthrough Parser ───────────────────────────────────────────────────────

# Pattern untuk mendeteksi tanggal dalam walkthrough
# Contoh: "April 14", "4/14", "~April 14th~" (format guide Hurricanehaon), dll.
DATE_PATTERNS = [
    # Format: "~Month Day~" atau "~Month Dayth/st/nd/rd~" (plain-text FAQ style)
    re.compile(
        r"~(January|February|March|April|May|June|July|August|September|October|November|December)"
        r"\s+(\d{1,2})(?:st|nd|rd|th)?~",
        re.IGNORECASE,
    ),
    # Format: "Month Day" atau "Month Dayth/st/nd/rd"
    re.compile(
        r"^(January|February|March|April|May|June|July|August|September|October|November|December)"
        r"\s+(\d{1,2})(?:st|nd|rd|th)?$",
        re.IGNORECASE,
    ),
    # Format: "M/D" atau "MM/DD"
    re.compile(r"^(\d{1,2})/(\d{1,2})$"),
]

# Separator pattern untuk plain-text FAQ (misal: "--- ~April 11th~ ---")
DATE_SEPARATOR_PATTERN = re.compile(
    r"-+\s*~(January|February|March|April|May|June|July|August|September|October|November|December)"
    r"\s+(\d{1,2})(?:st|nd|rd|th)?~\s*-+",
    re.IGNORECASE,
)

# Mapping nama bulan ke angka
MONTH_MAP = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

# Keyword yang menandakan sebuah event/activity
STORY_KEYWORDS    = ["event", "story", "cutscene", "dialogue", "forced", "automatic", "mandatory", "scene"]
SOCIAL_KEYWORDS   = ["social link", "sl", "arcana", "rank up", "hang out", "spend time"]
DEADLINE_KEYWORDS = ["deadline", "last chance", "must", "game over", "rescue", "by today", "expires"]
EXAM_KEYWORDS     = ["exam", "test", "quiz", "classroom", "question", "answer", "midterm", "final"]
ACTIVITY_KEYWORDS = ["recommend", "should", "can", "available", "option", "free time", "evening", "daytime"]


def detect_entry_type(text: str) -> str:
    """Deteksi tipe entry berdasarkan kata kunci dalam teks."""
    text_lower = text.lower()
    if any(k in text_lower for k in DEADLINE_KEYWORDS):
        return "deadline"
    if any(k in text_lower for k in EXAM_KEYWORDS):
        return "classroom"
    if any(k in text_lower for k in SOCIAL_KEYWORDS):
        return "social"
    if any(k in text_lower for k in STORY_KEYWORDS):
        return "story"
    if any(k in text_lower for k in ACTIVITY_KEYWORDS):
        return "activity"
    return "info"


def is_date_heading(text: str) -> dict | None:
    """
    Cek apakah teks adalah heading tanggal (berbagai format).
    Return dict {"month_num": int, "day": int, "date_str": str} atau None.
    """
    text = text.strip()

    # Cek DATE_SEPARATOR_PATTERN dulu (format "--- ~Month Day~ ---")
    m = DATE_SEPARATOR_PATTERN.match(text)
    if m:
        month_num = MONTH_MAP.get(m.group(1).lower(), 0)
        if month_num:
            return {"month_num": month_num, "day": int(m.group(2)), "date_str": text}

    for pat in DATE_PATTERNS:
        m = pat.match(text)
        if m:
            groups = m.groups()
            if len(groups) == 2 and groups[0].isdigit():
                # Format M/D
                return {
                    "month_num": int(groups[0]),
                    "day": int(groups[1]),
                    "date_str": text,
                }
            elif len(groups) == 2:
                # Format Month Day atau ~Month Day~
                month_num = MONTH_MAP.get(groups[0].lower(), 0)
                if month_num:
                    return {
                        "month_num": month_num,
                        "day": int(groups[1]),
                        "date_str": text,
                    }
    return None


def parse_walkthrough_section(html: str, month_name: str) -> dict:
    """
    Parse HTML dari satu section walkthrough (satu bulan).

    Return:
        {
            "month": str,
            "days": [
                {
                    "date": str,          # "4/14"
                    "day_num": int,        # 14
                    "month_num": int,      # 4
                    "entries": [
                        {
                            "type": str,       # story|social|classroom|deadline|activity|info
                            "title": str,
                            "content": str,
                        }
                    ]
                }
            ]
        }
    """
    soup = make_soup(html)
    month_num = MONTH_MAP.get(month_name.lower(), 0)
    days = []
    current_day = None

    # Iterasi semua elemen secara sequential
    for el in soup.find_all(["h1", "h2", "h3", "h4", "h5", "p", "ul", "ol", "li", "pre"]):
        tag = el.name.lower()
        text = clean_text(el.get_text(separator=" "))

        if not text or len(text) < 2:
            continue

        # Cek apakah teks ini adalah heading tanggal (tanggal bisa ada di tag <p> atau <h3>)
        date_info = is_date_heading(text)
        if date_info:
            if current_day is not None:
                days.append(current_day)
            current_day = {
                "date": f"{date_info['month_num']}/{date_info['day']}",
                "day_num": date_info["day"],
                "month_num": date_info["month_num"] or month_num,
                "date_label": text,
                "entries": [],
            }
            continue

        # Jika teks bukan tanggal, tapi terlihat seperti subheading (pendek, uppercase, atau dash)
        # Contoh: "-Responses-" atau "Afternoon"
        is_subheading = False
        if len(text) < 40 and (
            text.startswith("-") and text.endswith("-") or
            text.istitle() or
            text.isupper()
        ):
            is_subheading = True

        if current_day is not None:
            if is_subheading and tag in ("p", "h3", "h4"):
                # Jadikan entry baru
                entry_type = detect_entry_type(text)
                current_day["entries"].append({
                    "type": entry_type,
                    "title": text,
                    "content": "",
                })
            else:
                # Konten biasa, tambahkan ke entry terakhir
                if current_day["entries"]:
                    last_entry = current_day["entries"][-1]
                    if last_entry["content"]:
                        last_entry["content"] += "\n" + text
                    else:
                        last_entry["content"] = text
                else:
                    # Jika belum ada entry (misal konten langsung setelah tanggal)
                    entry_type = detect_entry_type(text)
                    current_day["entries"].append({
                        "type": entry_type,
                        "title": "",
                        "content": text,
                    })

    # Simpan hari terakhir
    if current_day is not None:
        days.append(current_day)

    # Fallback: jika tidak ada hari terdeteksi, buat entry tunggal
    if not days:
        blocks = extract_headings_and_blocks(soup)
        return {
            "month": month_name.lower(),
            "parsed_as_blocks": True,
            "blocks": blocks,
            "days": [],
        }

    return {
        "month": month_name.lower(),
        "month_num": month_num,
        "days": days,
    }


# ─── Dungeon Parser ───────────────────────────────────────────────────────────

# Keyword yang sering muncul di section dungeon
FLOOR_PATTERN = re.compile(r"floor\s*(\d+)", re.IGNORECASE)
LEVEL_PATTERN = re.compile(r"(?:level|lv\.?|lvl\.?)\s*(\d+)", re.IGNORECASE)
BOSS_KEYWORDS = ["boss", "shadow", "final boss", "mini-boss"]
WEAK_PATTERN  = re.compile(r"(?:weak(?:ness)?|vulnerable)\s*(?:to|:)?\s*(.+)", re.IGNORECASE)


AFFINITY_MAP = {
    "wk": "Weak",
    "str": "Resist",
    "nul": "Null",
    "rpl": "Repel",
    "drn": "Drain",
    "dr": "Drain",
    "-": "-",
    " ": "-",
    "": "-"
}

def normalize_affinity(val: str) -> str:
    v = val.lower().strip()
    return AFFINITY_MAP.get(v, val.strip() or "-")

def parse_ffaq_table(table_el) -> list[dict]:
    """Konversi HTML table ffaq menjadi list of dicts"""
    if not table_el:
        return []
    
    rows = table_el.find_all("tr")
    if not rows or len(rows) < 2:
        return []
        
    headers = []
    for th in rows[0].find_all(["th", "td"]):
        text = clean_text(th.get_text()).lower().strip()
        text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
        headers.append(text)
        
    data = []
    for row in rows[1:]:
        cols = row.find_all("td")
        if len(cols) != len(headers):
            continue
            
        row_data = {}
        for i, col in enumerate(cols):
            row_data[headers[i]] = clean_text(col.get_text())
        data.append(row_data)
        
    return data

def parse_dungeon_section(html: str, dungeon_name: str) -> dict:
    """
    Parse HTML dari satu section dungeon.

    Return:
        {
            "name": str,
            "floors_count": int,
            "recommended_level": int | None,
            "deadline": str | None,
            "bosses": list,
            "mini_bosses": list,
            "enemies": list,
            "floors": [{"floor": int, "notes": str}],
            "overview": str,
        }
    """
    soup = make_soup(html)
    blocks = extract_headings_and_blocks(soup)

    dungeon = {
        "id": re.sub(r"[^a-z0-9]+", "-", dungeon_name.lower()).strip("-"),
        "name": dungeon_name,
        "floors_count": 0,
        "recommended_level": None,
        "deadline": None,
        "boss": None,
        "bosses": [],
        "mini_bosses": [],
        "enemies": [],
        "floors": [],
        "overview": "",
        "raw_blocks": [],
    }

    full_text = soup.get_text(separator="\n")

    # Cari recommended level
    level_match = LEVEL_PATTERN.search(full_text)
    if level_match:
        dungeon["recommended_level"] = int(level_match.group(1))

    # Cari jumlah floor
    floor_matches = FLOOR_PATTERN.findall(full_text)
    if floor_matches:
        dungeon["floors_count"] = max(int(f) for f in floor_matches)

    # Cari deadline (format: Month/Day atau Month Day)
    deadline_pattern = re.compile(
        r"(?:deadline|rescue by|clear by|must clear).*?(\d{1,2}/\d{1,2}|\w+ \d{1,2})",
        re.IGNORECASE,
    )
    deadline_match = deadline_pattern.search(full_text)
    if deadline_match:
        dungeon["deadline"] = clean_text(deadline_match.group(1))

    # Parse tables
    for table in soup.find_all("table", class_="ffaq"):
        prev = table.find_previous_sibling(["h2", "h3", "h4", "p", "strong", "b"])
        title = "unknown"
        if prev:
            title = clean_text(prev.get_text()).lower()
            
        parsed_table = parse_ffaq_table(table)
        if not parsed_table:
            continue
            
        first_row = parsed_table[0]
        if "enemy" in first_row:
            for row in parsed_table:
                for k in ["phy", "fir", "ice", "elc", "wnd", "lgt", "drk"]:
                    if k in row:
                        row[k] = normalize_affinity(row[k])
            dungeon["enemies"].extend(parsed_table)
        elif "boss" in first_row:
            for row in parsed_table:
                for k in ["phy", "fir", "ice", "elc", "wnd", "lgt", "drk"]:
                    if k in row:
                        row[k] = normalize_affinity(row[k])
            if "mini" in title or "early" in title or "optional" in title:
                dungeon["mini_bosses"].extend(parsed_table)
            else:
                dungeon["bosses"].extend(parsed_table)

    # Parse blocks untuk boss & floors
    for block in blocks:
        title = block["title"].lower()
        content = " ".join(block["content_blocks"])

        # Boss section
        if any(kw in title for kw in BOSS_KEYWORDS):
            weak_match = WEAK_PATTERN.search(content)
            weaknesses = []
            if weak_match:
                weaknesses = [w.strip() for w in re.split(r"[,/&]", weak_match.group(1)) if w.strip()]

            # Tetap simpan ini untuk backward compatibility, tapi utamakan tables di kemudian hari
            if not dungeon["boss"]:
                dungeon["boss"] = {
                    "name": block["title"],
                    "weaknesses": weaknesses,
                    "strategy": content[:500] if content else "",
                }

        # Floor section
        floor_match = FLOOR_PATTERN.search(block["title"])
        if floor_match:
            dungeon["floors"].append({
                "floor": int(floor_match.group(1)),
                "title": block["title"],
                "notes": content[:300] if content else "",
            })

        # Simpan sebagai raw blocks untuk referensi
        dungeon["raw_blocks"].append({
            "level": block["level"],
            "title": block["title"],
            "content": content[:500],
        })

    # Overview: ambil paragraf pertama yang substantif
    first_paragraphs = soup.find_all("p")
    for p in first_paragraphs[:5]:
        text = clean_text(p.get_text())
        if len(text) > 50:
            dungeon["overview"] = text
            break

    return dungeon


# ─── Social Link Parser ───────────────────────────────────────────────────────

RANK_PATTERN   = re.compile(r"rank\s*(\d+)", re.IGNORECASE)
ANSWER_PATTERN = re.compile(r"(?:best|choose|answer|select|option)\s*[:#]?\s*(.+)", re.IGNORECASE)


def parse_social_link_section(html: str, arcana: str, character: str) -> dict:
    """
    Parse HTML dari satu section Social Link.

    Return:
        {
            "arcana": str,
            "character": str,
            "availability": str,
            "requirements": str,
            "location": str,
            "ranks": [
                {
                    "rank": int,
                    "choices": [{"text": str, "points": int, "is_best": bool}],
                    "notes": str,
                }
            ],
            "overview": str,
        }
    """
    soup = make_soup(html)
    blocks = extract_headings_and_blocks(soup)
    full_text = soup.get_text(separator="\n")

    sl = {
        "id": re.sub(r"[^a-z0-9]+", "-", character.lower()).strip("-"),
        "arcana": arcana,
        "character": character,
        "availability": "",
        "requirements": "",
        "location": "",
        "schedule": "",
        "ranks": [],
        "overview": "",
        "raw_blocks": [],
    }

    # Cari availability / requirement hints
    avail_pattern = re.compile(r"(?:available|unlock|start).*?(\d{1,2}/\d{1,2})", re.IGNORECASE)
    avail_match = avail_pattern.search(full_text)
    if avail_match:
        sl["availability"] = avail_match.group(1)

    # Cari requirement stats
    stat_pattern = re.compile(
        r"(?:require|need|must have)\s+(?:rank\s+\d+\s+)?(\w+)", re.IGNORECASE
    )
    stat_match = stat_pattern.search(full_text)
    if stat_match:
        sl["requirements"] = stat_match.group(1).title()

    # Parse blocks untuk ranks
    current_rank = None
    for block in blocks:
        title = block["title"]
        content = " ".join(block["content_blocks"])

        # Cek apakah ini heading rank
        rank_match = RANK_PATTERN.search(title)
        if rank_match:
            rank_num = int(rank_match.group(1))
            current_rank = {
                "rank": rank_num,
                "title": title,
                "choices": [],
                "notes": content[:300] if content else "",
            }
            sl["ranks"].append(current_rank)

            # Cari pilihan dialog (biasanya berupa list)
            choices = _extract_dialog_choices(soup, block)
            if choices:
                current_rank["choices"] = choices
        else:
            # Blok ini adalah konten umum
            sl["raw_blocks"].append({
                "level": block["level"],
                "title": title,
                "content": content[:300],
            })

    # Overview dari paragraf pertama
    for p in soup.find_all("p")[:5]:
        text = clean_text(p.get_text())
        if len(text) > 50:
            sl["overview"] = text
            break

    return sl


def _extract_dialog_choices(soup: BeautifulSoup, block: dict) -> list[dict]:
    """
    Extract pilihan dialog dari list items dalam suatu block.
    Cari pola: option text (+ points) atau [BEST] marker.
    """
    choices = []
    # Cari list items yang kemungkinan berisi pilihan dialog
    items = soup.find_all("li")
    for item in items:
        text = clean_text(item.get_text())
        if not text or len(text) < 5:
            continue
        # Cek apakah ada indikator "best" atau poin
        is_best = "best" in text.lower() or "★" in text or "(+3)" in text or "[best]" in text.lower()
        points = 0
        point_match = re.search(r"\(\+?(\d+)\)", text)
        if point_match:
            points = int(point_match.group(1))

        choices.append({
            "text": text,
            "points": points,
            "is_best": is_best,
        })
    return choices[:20]  # Batasi 20 pilihan per rank


# ─── Exam/Classroom Parser ────────────────────────────────────────────────────

QA_PATTERNS = [
    # Pattern "Q: ... A: ..."
    re.compile(r"Q[.:\s]+(.+?)\s+A[.:\s]+(.+?)(?=Q[.:\s]|$)", re.IGNORECASE | re.DOTALL),
    # Pattern "Question: ... Answer: ..."
    re.compile(r"Question[.:\s]+(.+?)\s+Answer[.:\s]+(.+?)(?=Question[.:\s]|$)", re.IGNORECASE | re.DOTALL),
]


def parse_exam_from_walkthrough(walkthrough_data: list[dict]) -> list[dict]:
    """
    Extract classroom questions & answers dari data walkthrough yang sudah diparsing.
    Mencari entries dengan type "classroom".

    Return:
        [{"date": str, "question": str, "answer": str, "month": str}]
    """
    exams = []
    for month_data in walkthrough_data:
        month = month_data.get("month", "")
        for day in month_data.get("days", []):
            date = day.get("date", "")
            for entry in day.get("entries", []):
                if entry.get("type") == "classroom":
                    content = entry.get("content", "")
                    title = entry.get("title", "")

                    # Coba extract Q&A dari content
                    combined = f"{title} {content}"
                    for pat in QA_PATTERNS:
                        matches = pat.findall(combined)
                        for q, a in matches:
                            exams.append({
                                "date": date,
                                "month": month,
                                "question": clean_text(q),
                                "answer": clean_text(a),
                            })
                    # Jika tidak ada pattern Q&A, simpan sebagai is
                    if not any(pat.findall(combined) for pat in QA_PATTERNS):
                        exams.append({
                            "date": date,
                            "month": month,
                            "question": clean_text(title),
                            "answer": clean_text(content),
                            "raw": True,
                        })
    return exams


# ─── Tips Parser ──────────────────────────────────────────────────────────────

def parse_tips_section(html: str) -> list[dict]:
    """
    Parse HTML dari section Tips & Tricks.

    Return:
        [{"category": str, "title": str, "content": str}]
    """
    soup = make_soup(html)
    blocks = extract_headings_and_blocks(soup)
    tips = []

    current_category = "General"
    for block in blocks:
        if block["level"] <= 2:
            current_category = block["title"]

        content = " ".join(block["content_blocks"])
        if content and len(content) > 20:
            tips.append({
                "category": current_category,
                "title": block["title"],
                "content": content[:1000],
            })

    return tips


# ─── Generic Section Parser ───────────────────────────────────────────────────

def parse_generic_section(html: str, section_name: str) -> dict:
    """
    Fallback parser untuk section yang tidak punya parser khusus.
    Menggunakan extract_headings_and_blocks sebagai struktur dasar.
    """
    soup = make_soup(html)
    blocks = extract_headings_and_blocks(soup)
    full_text = clean_text(soup.get_text(separator=" "))

    return {
        "section": section_name,
        "blocks": blocks,
        "full_text_preview": full_text[:500],
        "block_count": len(blocks),
    }


# ─── Multi-Section Page Parsers ───────────────────────────────────────────────
# Fungsi untuk parse halaman besar yang berisi banyak subsection sekaligus.
# Struktur GameFAQs: satu halaman bisa berisi semua bulan walkthrough,
# semua dungeon, atau semua social links — dipisahkan oleh heading dengan ID anchor.

def _split_html_by_anchor(soup: BeautifulSoup, anchor_ids: list[str]) -> dict[str, str]:
    """
    Split satu halaman besar menjadi potongan HTML per anchor ID.
    GameFAQs menggunakan elemen (h2/h3/h4) dengan id="anchor-name" sebagai pembatas.

    Mencari id di SEMUA elemen HTML, bukan hanya heading tag.

    Return:
        Dict mapping anchor_id_lowercase -> HTML string konten section itu.
    """
    anchor_ids_lower = [a.lower() for a in anchor_ids]
    anchor_set = set(anchor_ids_lower)

    # Kumpulkan semua elemen yang punya id sesuai anchor list
    # Simpan sebagai (index_dalam_anchor_list, element)
    found: list[tuple[int, any]] = []
    for el in soup.find_all(id=True):
        eid = el.get("id", "").lower().strip()
        if eid in anchor_set:
            try:
                idx = anchor_ids_lower.index(eid)
                # Jika elemen ini ada di dalam heading (contoh: <h3><a id="april"></a></h3>)
                # Maka gunakan elemen heading sebagai block utamanya
                parent_heading = el.find_parent(["h1", "h2", "h3", "h4"])
                target_el = parent_heading if parent_heading else el
                found.append((idx, target_el))
            except ValueError:
                pass

    # Urutkan berdasarkan urutan anchor_ids (bukan urutan di dokumen)
    found.sort(key=lambda x: x[0])

    result: dict[str, str] = {}

    for pos, (anchor_idx, start_el) in enumerate(found):
        anchor_id = anchor_ids_lower[anchor_idx]

        # Stop element = anchor element berikutnya yang ditemukan
        stop_el = found[pos + 1][1] if pos + 1 < len(found) else None

        # Kumpulkan HTML dari start_el sampai stop_el
        parts = [str(start_el)]
        for sibling in start_el.next_siblings:
            if sibling is stop_el:
                break
            parts.append(str(sibling))

        result[anchor_id] = "".join(parts)

    return result



def parse_walkthrough_by_month(html: str, month_order: list[str]) -> list[dict]:
    """
    Parse halaman walkthrough besar (semua bulan dalam 1 HTML)
    menjadi list data per bulan.

    Args:
        html: HTML string dari halaman walkthrough
        month_order: List nama bulan dalam urutan yang benar

    Return:
        List of month dicts (output dari parse_walkthrough_section per bulan)
    """
    soup = make_soup(html)
    anchor_ids = month_order + ["new-game-plus-walkthrough"]

    # Split HTML per bulan
    sections = _split_html_by_anchor(soup, anchor_ids)

    months = []
    for month_name in month_order:
        month_html = sections.get(month_name.lower())
        if not month_html or len(month_html.strip()) < 100:
            print(f"    [⚠️] Section '{month_name}' tidak ditemukan dalam halaman walkthrough")
            continue
        parsed = parse_walkthrough_section(month_html, month_name)
        months.append(parsed)
        print(f"    [✅] {month_name.capitalize():12s}: {len(parsed.get('days', []))} hari ter-parse")

    # NG+ jika ada
    ngplus_html = sections.get("new-game-plus-walkthrough")
    if ngplus_html and len(ngplus_html.strip()) > 100:
        parsed_ngplus = parse_walkthrough_section(ngplus_html, "ng_plus")
        months.append(parsed_ngplus)
        print(f"    [✅] NG+ Walkthrough : {len(parsed_ngplus.get('days', []))} entries ter-parse")

    # Fallback: jika tidak ada anchor yang ditemukan, parse seluruh halaman per bulan
    # menggunakan heading month names sebagai delimiter
    if not months:
        print("    [⚠️] Anchor split gagal, mencoba fallback parse per heading bulan...")
        months = _fallback_parse_by_month_headings(soup, month_order)

    return months


def _fallback_parse_by_month_headings(soup: BeautifulSoup, month_order: list[str]) -> list[dict]:
    """
    Fallback: split halaman berdasarkan heading yang teksnya adalah nama bulan.
    Dipakai ketika anchor ID tidak ditemukan di HTML.
    """
    months = []
    all_headings = soup.find_all(["h1", "h2", "h3"])

    # Temukan heading yang teksnya nama bulan
    month_heading_map: dict[str, any] = {}
    for h in all_headings:
        text = clean_text(h.get_text()).lower()
        for month in month_order:
            if text == month.lower() or text.startswith(month.lower()):
                month_heading_map[month.lower()] = h
                break

    for i, month_name in enumerate(month_order):
        start_h = month_heading_map.get(month_name.lower())
        if not start_h:
            continue

        # Cari next month heading
        next_months = month_order[i+1:]
        next_h = None
        for sibling in start_h.next_siblings:
            if hasattr(sibling, "get_text"):
                text = clean_text(sibling.get_text()).lower()
                for nm in next_months:
                    if text == nm.lower() or text.startswith(nm.lower()):
                        next_h = sibling
                        break
            if next_h:
                break

        # Kumpulkan konten section bulan ini
        parts = [str(start_h)]
        for sibling in start_h.next_siblings:
            if sibling is next_h:
                break
            parts.append(str(sibling))

        section_html = "".join(parts)
        if len(section_html) > 100:
            parsed = parse_walkthrough_section(section_html, month_name)
            months.append(parsed)

    return months


def parse_dungeons_page(html: str, dungeon_meta: list[dict]) -> list[dict]:
    """
    Parse halaman dungeons besar (semua dungeon dalam 1 HTML)
    menjadi list data per dungeon.

    Args:
        html: HTML string dari halaman dungeons
        dungeon_meta: List metadata dungeon dari structurer.DUNGEON_META

    Return:
        List of dungeon dicts
    """
    soup = make_soup(html)
    anchor_ids = [m["anchor"] for m in dungeon_meta]

    # Split HTML per dungeon
    sections = _split_html_by_anchor(soup, anchor_ids)

    dungeons = []
    for meta in dungeon_meta:
        anchor = meta["anchor"]
        dungeon_html = sections.get(anchor.lower())

        if not dungeon_html or len(dungeon_html.strip()) < 50:
            # Placeholder
            dungeons.append({
                **{k: v for k, v in meta.items() if k != "anchor"},
                "status": "not_found_in_page",
                "floors_count": 0,
                "boss": None,
                "floors": [],
                "overview": "",
            })
            print(f"    [⚠️] Dungeon '{meta['name']}' tidak ditemukan dalam halaman")
            continue

        parsed = parse_dungeon_section(dungeon_html, meta["name"])
        # Merge metadata
        parsed["id"]                 = meta["id"]
        parsed["order"]              = meta["order"]
        parsed["dungeon_num"]        = meta["dungeon_num"]
        parsed["is_golden_exclusive"]= meta.get("is_golden_exclusive", False)
        parsed["is_true_ending"]     = meta.get("is_true_ending", False)
        parsed["is_optional"]        = meta.get("is_optional", False)
        if not parsed.get("deadline"):
            parsed["deadline"] = meta.get("deadline")

        dungeons.append(parsed)
        print(f"    [✅] {meta['name']:30s}: {len(parsed.get('floors', []))} floors ter-parse")

    return dungeons


def parse_social_links_page(html: str, sl_meta: list[dict]) -> list[dict]:
    """
    Parse halaman social-links besar (semua SL dalam 1 HTML)
    menjadi list data per social link.

    Args:
        html: HTML string dari halaman social-links
        sl_meta: List metadata SL dari structurer.SOCIAL_LINK_META

    Return:
        List of social link dicts
    """
    soup = make_soup(html)
    anchor_ids = [m["anchor"] for m in sl_meta]

    # Split HTML per social link
    sections = _split_html_by_anchor(soup, anchor_ids)

    social_links = []
    for meta in sl_meta:
        anchor    = meta["anchor"]
        sl_html   = sections.get(anchor.lower())
        arcana    = meta["arcana"]
        character = meta["character"]

        if not sl_html or len(sl_html.strip()) < 50:
            social_links.append({
                **{k: v for k, v in meta.items() if k != "anchor"},
                "status": "not_found_in_page",
                "ranks": [],
                "overview": "",
            })
            continue

        parsed = parse_social_link_section(sl_html, arcana, character)

        # Merge metadata
        for field in ["arcana_num", "start_date", "deadline", "req_stat",
                       "req_job", "auto", "is_golden"]:
            if field in meta and not parsed.get(field):
                parsed[field] = meta[field]

        social_links.append(parsed)
        print(f"    [✅] {character:35s}: {len(parsed.get('ranks', []))} ranks ter-parse")

    return social_links
