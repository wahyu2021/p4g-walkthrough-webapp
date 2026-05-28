# =============================================================================
# structurer.py — Transform parsed data → final JSON output format
# =============================================================================

import json
import os

from config import OUTPUT_FILES, SECTIONS
from parser import (
    parse_walkthrough_by_month,
    parse_dungeons_page,
    parse_social_links_page,
    parse_exam_from_walkthrough,
    parse_tips_section,
    parse_generic_section,
    MONTH_MAP,
)


# ─── Metadata Dungeon (urutan kronologis + info) ─────────────────────────────

# Key = anchor ID di halaman dungeons
DUNGEON_META = [
    {"id": "shopping",  "name": "Twisted Shopping District", "order": 0,  "deadline": "4/11",  "dungeon_num": 0,  "anchor": "twisted-shopping-district"},
    {"id": "yukiko",    "name": "Yukiko's Castle",           "order": 1,  "deadline": "4/29",  "dungeon_num": 1,  "anchor": "yukikos-castle"},
    {"id": "bathhouse", "name": "Steamy Bathhouse",          "order": 2,  "deadline": "6/4",   "dungeon_num": 2,  "anchor": "steamy-bathhouse"},
    {"id": "marukyu",   "name": "Marukyu Striptease",        "order": 3,  "deadline": "7/9",   "dungeon_num": 3,  "anchor": "marukyu-striptease"},
    {"id": "void",      "name": "Void Quest",                "order": 4,  "deadline": "8/12",  "dungeon_num": 4,  "anchor": "void-quest"},
    {"id": "lab",       "name": "Secret Laboratory",         "order": 5,  "deadline": "10/5",  "dungeon_num": 5,  "anchor": "secret-laboratory"},
    {"id": "heaven",    "name": "Heaven",                    "order": 6,  "deadline": "11/20", "dungeon_num": 6,  "anchor": "heaven"},
    {"id": "magatsu",   "name": "Magatsu Inaba",             "order": 7,  "deadline": "12/24", "dungeon_num": 7,  "anchor": "magatsu-inaba"},
    {"id": "hollow",    "name": "Hollow Forest",             "order": 8,  "deadline": "1/13",  "dungeon_num": 8,  "anchor": "hollow-forest",    "is_golden_exclusive": True},
    {"id": "yomotsu",   "name": "Yomotsu Hirasaka",          "order": 9,  "deadline": "N/A",   "dungeon_num": 9,  "anchor": "yomotsu-hirasaka", "is_true_ending": True},
    {"id": "bosses",    "name": "Extra Bosses",              "order": 10, "deadline": "N/A",   "dungeon_num": 10, "anchor": "extra-bosses",     "is_optional": True},
]

# ─── Metadata Social Links ────────────────────────────────────────────────────

# Key = anchor ID di halaman social-links
SOCIAL_LINK_META = [
    {"id": "fool",       "arcana": "Fool",       "arcana_num": 0,  "character": "Investigation Team",         "anchor": "investigation-team-fool",               "auto": True},
    {"id": "magician",   "arcana": "Magician",   "arcana_num": 1,  "character": "Yosuke Hanamura",            "anchor": "yosuke-hanamura-magician",              "start_date": "4/16"},
    {"id": "priestess",  "arcana": "Priestess",  "arcana_num": 2,  "character": "Yukiko Amagi",               "anchor": "yukiko-amagi-priestess",                "start_date": "5/17"},
    {"id": "empress",    "arcana": "Empress",    "arcana_num": 3,  "character": "Margaret",                   "anchor": "margaret-empress",                     "start_date": "5/19"},
    {"id": "emperor",    "arcana": "Emperor",    "arcana_num": 4,  "character": "Kanji Tatsumi",              "anchor": "kanji-tatsumi-emperor",                 "start_date": "6/9"},
    {"id": "hierophant", "arcana": "Hierophant", "arcana_num": 5,  "character": "Ryotaro Dojima",             "anchor": "ryotaro-dojima-hierophant",              "start_date": "5/6"},
    {"id": "lovers",     "arcana": "Lovers",     "arcana_num": 6,  "character": "Rise Kujikawa",              "anchor": "rise-kujikawa-lovers",                  "start_date": "7/23", "auto": True},
    {"id": "chariot",    "arcana": "Chariot",    "arcana_num": 7,  "character": "Chie Satonaka",              "anchor": "chie-satonaka-chariot",                 "start_date": "4/18"},
    {"id": "justice",    "arcana": "Justice",    "arcana_num": 8,  "character": "Nanako Dojima",              "anchor": "nanako-dojima-justice",                 "start_date": "5/3",  "req_stat": "Expression"},
    {"id": "hermit",     "arcana": "Hermit",     "arcana_num": 9,  "character": "The Fox",                   "anchor": "fox-hermit",                           "start_date": "5/5",  "auto": True},
    {"id": "fortune",    "arcana": "Fortune",    "arcana_num": 10, "character": "Naoto Shirogane",            "anchor": "naoto-shirogane-fortune",               "start_date": "10/21","req_stat": "Courage+Knowledge"},
    {"id": "strength",   "arcana": "Strength",   "arcana_num": 11, "character": "Kou / Daisuke",             "anchor": "fellow-athletes-strength",              "start_date": "4/19"},
    {"id": "hanged",     "arcana": "Hanged Man",  "arcana_num": 12, "character": "Naoki Konishi",             "anchor": "sakis-brother-hanged-man",               "start_date": "6/8",  "req_stat": "Understanding Rank 3"},
    {"id": "death",      "arcana": "Death",      "arcana_num": 13, "character": "Hisano Kuroda",             "anchor": "old-lady-death",                       "req_stat": "Devil Rank 4",         "req_job": "Hospital"},
    {"id": "temperance", "arcana": "Temperance", "arcana_num": 14, "character": "Eri Minami",                "anchor": "young-mother-temperance",               "req_stat": "Understanding Rank 3", "req_job": "Daycare"},
    {"id": "devil",      "arcana": "Devil",      "arcana_num": 15, "character": "Sayoko Uehara",             "anchor": "nurse-devil",                          "req_stat": "Diligence Rank 3",     "req_job": "Hospital"},
    {"id": "tower",      "arcana": "Tower",      "arcana_num": 16, "character": "Shu Nakajima",              "anchor": "tutored-student-tower",                 "req_stat": "Understanding Rank 5", "req_job": "Tutor"},
    {"id": "star",       "arcana": "Star",       "arcana_num": 17, "character": "Teddie",                   "anchor": "teddie-star",                          "start_date": "6/24",  "auto": True},
    {"id": "moon",       "arcana": "Moon",       "arcana_num": 18, "character": "Ai Ebihara",               "anchor": "ai-ebihara-moon",                      "req_stat": "Strength Rank 4"},
    {"id": "sun",        "arcana": "Sun",        "arcana_num": 19, "character": "Yumi Ozawa & Ayane Matsunaga", "anchor": "yumi-ozawa-and-ayane-matsunaga-sun", "start_date": "4/25",  "req_job": "Culture Club"},
    {"id": "judgement",  "arcana": "Judgement",  "arcana_num": 20, "character": "Seekers of Truth",          "anchor": "seekers-of-truth-judgement",             "auto": True},
    {"id": "jester",     "arcana": "Jester",     "arcana_num": 21, "character": "Tohru Adachi",              "anchor": "tohru-adachi-jester",                  "start_date": "5/13"},
    {"id": "aeon",       "arcana": "Aeon",       "arcana_num": 22, "character": "Marie",                    "anchor": "marie-aeon",                           "start_date": "4/18", "is_golden": True, "deadline": "12/23"},
]

# Urutan bulan walkthrough
MONTH_ORDER = [
    "april", "may", "june", "july", "august", "september",
    "october", "november", "december", "january", "february", "march",
]


# ─── Main Structurer ──────────────────────────────────────────────────────────

def structure_all(raw_sections: dict[str, str]) -> dict[str, list | dict]:
    """
    Transform semua HTML sections yang sudah di-fetch menjadi structured JSON.

    Args:
        raw_sections: Dict mapping section_key → HTML string

    Return:
        Dict dengan keys: walkthrough, dungeons, social_links, exams, activities, tips
    """
    print("\n[🗂️] Menyusun data ke dalam struktur JSON...")

    # ── 1. Walkthrough ──
    print("  [📅] Parsing walkthrough...")
    walkthrough_data = _structure_walkthrough(raw_sections)

    # ── 2. Dungeons ──
    print("  [⚔️] Parsing dungeons...")
    dungeons_data = _structure_dungeons(raw_sections)

    # ── 3. Social Links ──
    print("  [💬] Parsing social links...")
    social_links_data = _structure_social_links(raw_sections)

    # ── 4. Exams (diekstrak dari walkthrough) ──
    print("  [📝] Extracting exam answers dari walkthrough...")
    exams_data = parse_exam_from_walkthrough(walkthrough_data)

    # ── 5. Activities / Tips ──
    print("  [💡] Parsing tips & activities...")
    tips_data    = _structure_tips(raw_sections)
    activities_data = _structure_activities(raw_sections)

    # ── 6. Introduction ──
    intro_data = {}
    if "introduction" in raw_sections:
        intro_data = parse_generic_section(raw_sections["introduction"], "introduction")

    result = {
        "walkthrough":  walkthrough_data,
        "dungeons":     dungeons_data,
        "social_links": social_links_data,
        "exams":        exams_data,
        "activities":   activities_data,
        "tips":         tips_data,
        "introduction": intro_data,
    }

    print(f"  [✅] Structuring selesai.")
    print(f"       - Walkthrough: {len(walkthrough_data)} bulan")
    print(f"       - Dungeons:    {len(dungeons_data)}")
    print(f"       - Social Links:{len(social_links_data)}")
    print(f"       - Exams:       {len(exams_data)} Q&A")
    print(f"       - Tips:        {len(tips_data)}")

    return result


def _structure_walkthrough(raw_sections: dict) -> list[dict]:
    """
    Parse halaman walkthrough tunggal menjadi data per bulan.
    Halaman walkthrough berisi SEMUA bulan dalam satu HTML,
    dipisahkan oleh heading anchor (#april, #may, dst).
    """
    if "walkthrough" not in raw_sections:
        return []

    # Gunakan parser yang bisa split per bulan dari 1 halaman besar
    return parse_walkthrough_by_month(raw_sections["walkthrough"], MONTH_ORDER)


def _structure_dungeons(raw_sections: dict) -> list[dict]:
    """
    Parse halaman dungeons tunggal menjadi list per dungeon.
    Halaman dungeons berisi SEMUA dungeon dalam satu HTML.
    """
    if "dungeons" not in raw_sections:
        # Kembalikan placeholder dari metadata
        return [
            {
                **{k: v for k, v in meta.items() if k != "anchor"},
                "status": "not_scraped",
                "floors_count": 0,
                "boss": None,
                "floors": [],
                "overview": "",
            }
            for meta in DUNGEON_META
        ]

    parsed_list = parse_dungeons_page(raw_sections["dungeons"], DUNGEON_META)
    return parsed_list


def _structure_social_links(raw_sections: dict) -> list[dict]:
    """
    Parse halaman social-links tunggal menjadi list per arcana/karakter.
    Halaman social-links berisi SEMUA social link dalam satu HTML.
    """
    if "social_links" not in raw_sections:
        return [
            {
                **{k: v for k, v in meta.items() if k != "anchor"},
                "status": "not_scraped",
                "ranks": [],
                "overview": "",
            }
            for meta in SOCIAL_LINK_META
        ]

    return parse_social_links_page(raw_sections["social_links"], SOCIAL_LINK_META)


def _structure_tips(raw_sections: dict) -> list[dict]:
    """Structure tips & tricks data."""
    if "tips" in raw_sections:
        return parse_tips_section(raw_sections["tips"])
    return []


def _structure_activities(raw_sections: dict) -> dict:
    """Structure activities & quests data."""
    result = {}
    if "activities" in raw_sections:
        result["activities"] = parse_generic_section(raw_sections["activities"], "activities")
    return result


# ─── JSON Saver ───────────────────────────────────────────────────────────────

def save_all_json(structured_data: dict):
    """
    Simpan semua data terstruktur ke file JSON.
    """
    print("\n[💾] Menyimpan file JSON...")
    os.makedirs(os.path.dirname(list(OUTPUT_FILES.values())[0]), exist_ok=True)

    for key, filepath in OUTPUT_FILES.items():
        if key not in structured_data:
            continue
        data = structured_data[key]
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"  [✅] {os.path.basename(filepath):30s} ({size_kb:.1f} KB)")

    print(f"\n[🎉] Semua file JSON tersimpan di: {os.path.dirname(list(OUTPUT_FILES.values())[0])}")


def load_raw_htmls_from_disk() -> dict[str, str]:
    """
    Load semua raw HTML yang sudah tersimpan di disk.
    Berguna untuk re-run parsing tanpa re-fetch dari internet.
    """
    from config import RAW_DIR
    result = {}
    if not os.path.exists(RAW_DIR):
        return result

    for filename in os.listdir(RAW_DIR):
        if filename.endswith(".html"):
            key = filename.replace(".html", "")
            filepath = os.path.join(RAW_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                result[key] = f.read()

    print(f"[📂] Loaded {len(result)} raw HTML files dari {RAW_DIR}")
    return result
