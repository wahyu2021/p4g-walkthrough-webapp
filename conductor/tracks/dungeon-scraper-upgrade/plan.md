# Implementation Plan: Dungeon Scraper Upgrade

## Phase 1: Python Scraper Enhancement
1. **Modify `scraper/parser.py`**:
   - Add a new function `parse_dungeon_section(soup)`.
   - Implement `parse_ffaq_table(table_element)` to convert HTML tables into JSON-friendly lists of objects.
   - Use `find_next_sibling` to navigate between `<h3>` headers and their corresponding paragraphs/tables.
2. **Update `scraper/main.py`**:
   - Ensure the `dungeons` section is included in the scraping queue.
3. **Data Post-processing**:
   - Map string-based weaknesses (Wk, Str, Nul, Rpl, Drn) into a consistent format.

## Phase 2: Verification
1. Run `python main.py --sections dungeons`.
2. Inspect `data/dungeons.json` to ensure:
   - "Yukiko's Castle" has a list of enemies with HP and Weaknesses.
   - "Shadow Yukiko" has correct boss stats.
   - Treasure lists are separated by "Regular" and "Rare".

## Phase 3: Integration Prep
1. Update `webapp/src/types/walkthrough.ts` to accommodate the new complex dungeon schema.