# Implementation Plan: Interactive Dungeon Guide

## Phase 1: UI Components
1. **EnemyRow (Atom/Molecule)**: A horizontal row showing an enemy's name and its elemental grid (Phy, Fir, Ice, etc.).
2. **LootSection (Molecule)**: A styled list for treasure items and shuffle personas.
3. **DungeonDetail (Organism)**: An expandable section within `DungeonsPage` that reveals the new data.

## Phase 2: State & Logic
1. Update `DungeonCard` to handle an "expanded" state.
2. Implement a filtering search bar for enemies (e.g., "Show enemies weak to Wind").

## Phase 3: Visual Polish
1. Add custom icons for each element (Fire, Ice, Elec, Wind, Light, Dark).
2. Add the "Fog" warning styling for bosses.

## Phase 4: Verification
1. Verify all data from the upgraded `dungeons.json` renders correctly.
2. Test on mobile (horizontal scrolling for the bestiary table might be needed).