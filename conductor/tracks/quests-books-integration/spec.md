# Specification: Quests and Books Integration

## Overview
The Social Stats Tracker page currently has placeholders for a "Books Library" and a "Quest Log". This feature will populate those sections with actual game data. 

## Requirements
1. **Scraping**: The Python scraper must fetch the `activities` section which contains the Quests and Books tables/lists.
2. **Parsing**: 
   - Extract Quests: ID/Number, Name, Available Date, Location, and Reward.
   - Extract Books: Name, Chapters (number of reading sessions), How to Obtain, and the Stat/Benefit gained.
3. **Data Storage**: Generate `quests.json` and `books.json` and move them to `webapp/src/data/`.
4. **State Management**: Extend `ProgressContext` to allow users to toggle the completion status of individual books and quests.
5. **UI**: Render the lists in `TrackerPage.tsx`, allowing the user to filter or sort (e.g., by completed/uncompleted) and click to check them off.