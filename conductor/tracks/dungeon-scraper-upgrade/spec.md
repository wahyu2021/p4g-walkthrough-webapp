# Specification: Dungeon Scraper Upgrade

## 1. Objective
Enhance the Python scraper to extract rich, structured data from the "Dungeons" section of the GameFAQs guide. This includes bestiaries, boss stats, treasure lists, and Persona drops.

## 2. Extraction Requirements
- **Target URL**: `https://gamefaqs.gamespot.com/vita/641695-persona-4-golden/faqs/76145/dungeons`
- **Dungeon Metadata**: Extract `Available`, `Last Day`, `Floors`, `Fixed Floors`, `Boss Floors`, and `Hidden Item`.
- **Table Parsing**:
  - Implement a generic table parser for `table.ffaq`.
  - Maps columns (Lv, HP, SP, Phy, Fir, Ice, Elc, Wnd, Lgt, Drk) into a structured `stats` object.
  - Distinguish between `Enemies`, `Mini Bosses`, `Bosses`, and `Side Bosses`.
- **List Extraction**:
  - Parse `Treasure Chests` (Regular, Rare, Fixed) grouped by floors.
  - Parse `Shuffle Time Personas` grouped by floors.
- **Content Cleaning**: Strip unnecessary whitespace and handle "N/A" or "?" values gracefully.

## 3. Success Criteria
- Running the scraper produces a `dungeons.json` that contains an array of objects with full enemy and boss data.
- The `floors` array in each dungeon object is populated with specific loot and persona data.
- Weaknesses are mapped as an easy-to-read object (e.g., `{ "fire": "Wk", "ice": "Str" }`).