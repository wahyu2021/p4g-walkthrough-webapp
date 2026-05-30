# Implementation Plan: Quests and Books Integration

## Phase 1: Scrape & Parse Data
1. Run `python main.py --sections activities` to fetch the raw HTML.
2. If Cloudflare blocks it, we might need to manually curate the data or run `--no-headless`. *Fallback: create curated static JSONs for Books and Quests if the scraper strategy proves too complex for this phase.*
3. Write parser logic in `scraper/parser.py` (e.g., `parse_quests` and `parse_books` functions) assuming the data is in table format.
4. Update `scraper/structurer.py` to output `quests.json` and `books.json`.

## Phase 2: Frontend Data & Types
1. Move the generated JSONs to `webapp/src/data/`.
2. Create `webapp/src/types/collections.ts` with `Quest` and `Book` interfaces.
3. Extend `ProgressContextInstance.tsx` to include `completedQuests` and `completedBooks` (Records of string to boolean).

## Phase 3: UI Implementation
1. Create `QuestRow.tsx` and `BookRow.tsx` (Molecules).
2. Update `TrackerPage.tsx` to map over the JSON data and display these rows.
3. Ensure visual styling fits the P4G black/yellow motif, using `clsx` to style completed items (e.g., dimming them or crossing them out).

## Phase 4: Validation
1. Verify the data is correctly rendered.
2. Toggle several books and quests, reload the page, and ensure the state persists via LocalStorage.